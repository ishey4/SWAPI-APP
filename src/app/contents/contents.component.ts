import { Component, OnInit, Input } from '@angular/core';
import { SwapiService } from '../swapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {
  //this is the table of contents
  constructor(private swapiService: SwapiService, private router: Router) { }
  @Input() swapiNode: any
  public Sections: string[] = []

  //checks to see if the section has a value.
  //if so it can be added to the table of contents
  hasValue(sectionName) {
    let itm = this.swapiNode[sectionName]
    if (itm instanceof (Array)) { return itm.length }
    else { return itm }
  }

  ScrollTo(section: string) { window.document.getElementById(section).scrollIntoView(); }
  ngOnInit() { }

}
