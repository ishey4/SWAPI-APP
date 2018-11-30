import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SwapiService implements OnInit {
  URLs: any = {};
  private waitingForResponse: any = {}
  public ErrorMsg: string = '';
 
 
  //Object Constructor gets the URL 
  //saves the URL and result locally for later retrival
  //then maps the result to the object
  ObjectConsructor(link: string, mapTo: any, objName: string) {
    if (this.URLs[link]) { this.SimpleMapper(this.URLs[link], mapTo) }
    else {
      if (!this.waitingForResponse[link]) {
        this.waitingForResponse[link] = true;
        this.http.get(link)
          .subscribe(
            this.DataClosureWrapper(this, link, mapTo, objName),
            this.ErrorClosureWrapper(this)
          )
      }
    }
  }

  //need to wrap the error in a closure so i can keep a referance to scope.
  ErrorClosureWrapper($this) {
    return (err) => {
      console.log(err);
      $this.ErrorMsg = "I can't seem to find that. Please choose someone else"
      $this.route.navigate(['']);
      //throw "Error getting API:";
    }
  }


  DataClosureWrapper($this, link: string, mapTo: any, objName: string) {
    return (data) => {
      $this.URLs[link] = $this.Instanciator(objName, data);
      $this.URLs[link].LoadComplete = true;
      $this.SimpleMapper($this.URLs[link], mapTo);
    }
  }

  //this is the basic constructor for the classes.
  //string(used for URLs) it calls the object constructor,
  //object(the actual object data) calls the mapper
  //other (no idea what it could be) throws unknow type
  BasicClassConstructor(param: any, caller: any, type: string) {
    switch (typeof (param)) {
      case 'string': window['swapi']['ObjectConsructor'](param, caller, type); break;
      case 'object': window['swapi']['SimpleMapper'](param, caller); break;
      default: throw 'Unknow Type'; break;
    }
  }

  //sets this._<typeName>List to the list for links to look up
  GeneralArraySetter(type: string, obj: any, val: any) {obj['_' + type + 'Ref'] = val;}

  //checks if this._<typeName> exists
  //if not creates it, instansiates all links in the
  // this._<typeName>List, and adds them to the list.
  //finally returns the list.
  GeneralArrayGetter(type: string, obj: any) {
    if (!obj['is' + type]) {
      obj['_' + type] = [];
      obj['_' + type + 'Ref'].forEach(el => {
        let newItm = this.Instanciator(type, el)
        obj['_' + type].push(newItm)
      });
    }
    return obj['_' + type]
  }

  //stub for arraygetter
  GeneralObjectSetter(type: string, obj: any, val: any) { this.GeneralArraySetter(type, obj, val) }

  //similar to GeneralArrayGetter, but for objects
  GeneralObjectGetter(type: string, obj: any) {
    if (!obj['_' + type]) {
      obj['_' + type] = (this.Instanciator(type, obj['_' + type + 'Ref']))
    }
    return obj['_' + type]
  }

  //Checks each item in a given list to make sure they are loaded
  isListLoaded(type: string, array: any): boolean {
    if (!array || !array['_' + type] || !array['_' + type + 'Ref']) { return false }
    let itmCnt: number = 0;
    if (array['_' + type] instanceof (Array)) {
      array['_' + type].forEach(element => {
        if (element.LoadComplete) { itmCnt = itmCnt + 1 }
      });
      return itmCnt === array['_' + type + 'Ref'].length
    }
    return array['_' + type].LoadComplete
  }

  //will instansiate classes using the class name
  //have some variances of certain classes
  Instanciator(cls: string, values: any) {
    let rtn: any;
    switch (cls.toLocaleLowerCase()) {
      case 'film': rtn = new Film(values); break;
      case 'films': rtn = new Film(values); break;
      case 'people': rtn = new People(values); break;
      case 'planet': rtn = new Planet(values); break;
      case 'planets': rtn = new Planet(values); break;
      case 'homeworld': rtn = new Planet(values); break;
      case 'species': rtn = new Specie(values); break;
      case 'vehicles': rtn = new Vehicle(values); break;
      case 'vehicle': rtn = new Vehicle(values); break;
      case 'starship': rtn = new StarShip(values); break;
      case 'starships': rtn = new StarShip(values); break;
      case 'residents': rtn = new People(values); break;
    }
    return rtn
  }
  
 //will map all the keys from 1 object to another
  SimpleMapper(obj: any, mapTo: any) {
    Object.keys(obj).forEach(key => {
      mapTo[key] = obj[key]
    })
  }

  //formats the date in Thursday, May 19 2005 layout
  getFormattedDate(date: Date) {
    let rtn: string = ''
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septembe', 'October', 'November', 'December',]
    date = new Date(date)
    rtn = rtn + days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate().toString() + ' ' + date.getFullYear()
    return rtn
  }

 

  //need to make this available globally for the other classes to call.
  ngOnInit() {window['swapi'] = this;}
  
  constructor(private http: HttpClient, private route: Router) { }
}


//I decided to create the classes outside of angular modules using only JS.
//The classes have constructors getters and setters that will allow for easily
//creating more classes and maintaining them
//while i can skip specifically coding the classes i think doing it this way is simple,
// and will greatly benifit future usabilty and flexability of the application.
export class People {
  constructor(x: any) { window['swapi']['BasicClassConstructor'](x, this, 'People') }

  get isfilms(): boolean { return window['swapi']['isListLoaded']('Film', this); }
  get films(): Film[] { return window['swapi']['GeneralArrayGetter']('Film', this) }
  set films(val) { window['swapi']['GeneralArraySetter']('Film', this, val) }

  get ishomeworld(): boolean { this.homeworld; return window['swapi']['isListLoaded']('Planet', this); }
  get homeworld(): Planet { return window['swapi']['GeneralObjectGetter']('Planet', this) }
  set homeworld(val: Planet) { window['swapi']['GeneralObjectSetter']('Planet', this, val) }

  get isspecies(): boolean { this.species; return window['swapi']['isListLoaded']('Species', this); }
  set species(val: Specie[]) { window['swapi']['GeneralArraySetter']('Species', this, val) }
  get species(): Specie[] { return window['swapi']['GeneralArrayGetter']('Species', this) }

  get isstarships(): boolean { return window['swapi']['isListLoaded']('StarShip', this); }
  set starships(val: StarShip[]) { window['swapi']['GeneralArraySetter']('StarShip', this, val) }
  get starships(): StarShip[] { return window['swapi']['GeneralArrayGetter']('StarShip', this) }

  get isvehicles(): boolean { return window['swapi']['isListLoaded']('vehicles', this); }
  set vehicles(val: StarShip[]) { window['swapi']['GeneralArraySetter']('vehicles', this, val) }
  get vehicles(): StarShip[] { return window['swapi']['GeneralArrayGetter']('vehicles', this) }
  sections = ['films','vehicles', 'starships', 'species', 'homeworld']
  detailsToShow = ['birth_year', 'eye_color', 'gender', 'hair_color', 'height', 'mass', 'name', 'skin_color']
  birth_year: string
  eye_color: string
  gender: string
  hair_color: string
  height: string
  mass: string
  name: string
  skin_color: string
  created: any
  edited: any
  url: string
  LoadComplete: boolean = false
}

export class Film {
  constructor(x: any) { window['swapi']['BasicClassConstructor'](x, this, 'Film') }

  get ischaracters(): boolean { this.characters; return window['swapi']['isListLoaded']('People', this); }
  set characters(val: StarShip[]) { window['swapi']['GeneralArraySetter']('People', this, val) }
  get characters(): StarShip[] { return window['swapi']['GeneralArrayGetter']('People', this) }

  get isplanets(): boolean { this.planets; return window['swapi']['isListLoaded']('Planet', this); }
  get planets(): Planet { return window['swapi']['GeneralArrayGetter']('Planet', this) }
  set planets(val: Planet) { window['swapi']['GeneralArraySetter']('Planet', this, val) }

  get isstarships(): boolean { this.starships; return window['swapi']['isListLoaded']('StarShip', this); }
  set starships(val: StarShip[]) { window['swapi']['GeneralArraySetter']('StarShip', this, val) }
  get starships(): StarShip[] { return window['swapi']['GeneralArrayGetter']('StarShip', this) }

  get isvehicles(): boolean { return window['swapi']['isListLoaded']('vehicles', this); }
  set vehicles(val: StarShip[]) { window['swapi']['GeneralArraySetter']('vehicles', this, val) }
  get vehicles(): StarShip[] { return window['swapi']['GeneralArrayGetter']('vehicles', this) }

  get isspecies(): boolean { this.species; return window['swapi']['isListLoaded']('Species', this); }
  set species(val: Specie[]) { window['swapi']['GeneralArraySetter']('Species', this, val) }
  get species(): Specie[] { return window['swapi']['GeneralArrayGetter']('Species', this) }

  sections = ['vehicles', 'starships', 'species', 'planets', 'characters']
  detailsToShow = ['title', 'episode_id', 'opening_crawl', 'director', 'producer', 'release_date']
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  get formatted_release_date():string{return window['swapi']['getFormattedDate'](this.release_date)}
  created: any
  edited: any
  url: string
  LoadComplete: boolean = false
}

export class StarShip {
  constructor(x) { window['swapi']['BasicClassConstructor'](x, this, 'StarShip') }

  get ispilots(): boolean { this.pilots; return window['swapi']['isListLoaded']('People', this); }
  set pilots(val: StarShip[]) { window['swapi']['GeneralArraySetter']('People', this, val) }
  get pilots(): StarShip[] { return window['swapi']['GeneralArrayGetter']('People', this) }

  get isfilms(): boolean { return window['swapi']['isListLoaded']('Film', this); }
  get films(): Film[] { return window['swapi']['GeneralArrayGetter']('Film', this) }
  set films(val) { window['swapi']['GeneralArraySetter']('Film', this, val) }

  sections = ['films', 'pilots']
  detailsToShow = ['name', 'model', 'manufacturer', 'cost_in_credits', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'hyperdrive_rating', 'MGLT', 'starship_class']
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  created: string
  edited: string
  url: string
  LoadComplete: boolean = false
}

export class Vehicle {
  constructor(x) { window['swapi']['BasicClassConstructor'](x, this, 'Vehicle') }

  get ispilots(): boolean { this.pilots; return window['swapi']['isListLoaded']('People', this); }
  set pilots(val: StarShip[]) { window['swapi']['GeneralArraySetter']('People', this, val) }
  get pilots(): StarShip[] { return window['swapi']['GeneralArrayGetter']('People', this) }

  get isfilms(): boolean { return window['swapi']['isListLoaded']('Film', this); }
  get films(): Film[] { return window['swapi']['GeneralArrayGetter']('Film', this) }
  set films(val) { window['swapi']['GeneralArraySetter']('Film', this, val) }

  sections = ['films', 'pilots']
  detailsToShow = ['name', 'model', 'manufacturer', 'cost_in_credits', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'vehicle_class']
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  vehicle_class: string
  created: string
  edited: string
  url: string
  LoadComplete: boolean = false
}

export class Specie {
  constructor(x) { window['swapi']['BasicClassConstructor'](x, this, 'Species') }

  get ispeople(): boolean { this.people; return window['swapi']['isListLoaded']('People', this); }
  set people(val: StarShip[]) { window['swapi']['GeneralArraySetter']('People', this, val) }
  get people(): StarShip[] { return window['swapi']['GeneralArrayGetter']('People', this) }

  get isfilms(): boolean { return window['swapi']['isListLoaded']('Film', this); }
  get films(): Film[] { return window['swapi']['GeneralArrayGetter']('Film', this) }
  set films(val) { window['swapi']['GeneralArraySetter']('Film', this, val) }

  sections = ['films', 'people']
  detailsToShow = ['name', 'classification', 'designation', 'average_height', 'skin_colors', 'hair_colors', 'eye_colors', 'average_lifespan', 'homeworld', 'language']

  name: string
  classification: string
  designation: string
  average_height: string
  skin_colors: string
  hair_colors: string
  eye_colors: string
  average_lifespan: string
  homeworld: Planet
  language: string
  created: string
  edited: string
  url: string
  LoadComplete: boolean = false
}

export class Planet {
  constructor(x) { window['swapi']['BasicClassConstructor'](x, this, 'Planet') }

  get isresidents(): boolean { this.residents; return window['swapi']['isListLoaded']('People', this); }
  set residents(val: StarShip[]) { window['swapi']['GeneralArraySetter']('People', this, val) }
  get residents(): StarShip[] { return window['swapi']['GeneralArrayGetter']('People', this) }

  get isfilms(): boolean { return window['swapi']['isListLoaded']('Film', this); }
  get films(): Film[] { return window['swapi']['GeneralArrayGetter']('Film', this) }
  set films(val) { window['swapi']['GeneralArraySetter']('Film', this, val) }

  sections = ['films', 'residents']
  detailsToShow = ['name', 'rotation_period', 'orbital_period', 'diameter', 'climate', 'gravity', 'terrain', 'surface_water', 'population']

  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  created: string
  edited: string
  url: string
  LoadComplete: boolean = false
}