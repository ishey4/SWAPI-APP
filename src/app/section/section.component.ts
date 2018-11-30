import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  @Input() swapiNode: any;
  @Input() sectionName;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { }


  //Checks id the node has contents.
  hasContents() {
    let itm = this.swapiNode[this.sectionName]
    let subSections = (this.swapiNode[this.sectionName] && this.swapiNode["is" + this.sectionName])
    if (subSections === undefined) { subSections = true }
    if (itm instanceof (Array)) { return itm.length && subSections }
    else { return (itm && itm.LoadComplete && subSections) === true }
  }

  //gets the link for navigation to the next page.
  getLink(filmURL: string) {
    let url = filmURL.replace('https://swapi.co/api', '')
    this.router.navigate[url];
    let ary = filmURL.replace('https://swapi.co/api', '').split('/')
    ary.pop()
    return ary
  }
}
