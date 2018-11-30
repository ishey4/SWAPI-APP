import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwapiService } from '../swapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-nest',
  templateUrl: './nest.component.html',
  styleUrls: ['./nest.component.css']
})
export class NestComponent implements OnInit,OnDestroy {
  title = 'swapi-app';
  ObjName: string;
  ID: string;
  charactersJSON: any;
  CurrentNode: any;
  CurrentNodeType:string;
  SelectedValue: string = '';
  ErrorMsg:string;
  ShowAll:boolean=true

  constructor(private http: HttpClient, private swapi: SwapiService, private route: ActivatedRoute, private router: Router) {
    this.ObjName = this.route.snapshot.params['obj']
    this.ID = this.route.snapshot.params['id']
  }

  getChrsJson(): any {
    this.http.get('assets/characters.json').subscribe(data => {
      this.charactersJSON = data['characters'];
    })
  }

  LinkSelected() {
    this.router.navigate([this.SelectedValue.replace('https://swapi.co/api', '')])
  }

  getNode(): any {
    this.swapi.ngOnInit();
  }

  ngOnInit() {
    this.ErrorMsg=this.swapi.ErrorMsg
    this.swapi.ErrorMsg='';
    this.CurrentNode = this.getNode();
    this.getChrsJson();
    this.route.params.subscribe(data => {
      if (data.obj && data.id) {
        this.ShowAll=false;
        let link = this.createSwapiLink(data.obj, data.id)
        this.CurrentNode = this.swapi.Instanciator(data.obj, link)
        this.CurrentNodeType=this.CurrentNode.constructor.name;
        console.log(this.CurrentNode)
        this.ShowAll=true;
      }
    })
  }

  ngOnDestroy(){}
  
  createSwapiLink(obj: String, id: string) {
    return 'https://swapi.co/api/' + obj + '/' + id + '/'
  }
}
