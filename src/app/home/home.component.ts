import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { People } from '../resources/models';
declare var require: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  people: People[] = [];
  loading: boolean = true;
  error: string = '';
  count: number = 0;
  next: string = '';
  previous: string = '';
  page_id: any;
  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
       this.apollo.watchQuery({query: gql`
        {
          allPeople{
              count,
              next,
              previous,
                results {
                  name,
                  gender,
                  mass,
                  height,
                  homeworld
              }
          }
        }
      `,
    }).valueChanges.subscribe((result: any) => {
      this.people = result.data.allPeople.results;
      this.loading = result.loading;
      this.error = result.error; 
      this.count = result.data.allPeople.count;
      this.next = result.data.allPeople.next;
      this.previous = result.data.allPeople.previous;
    });
  }

  public paginate(link: string) {
    this.loading = true;
    const last = require('lodash.last');
    this.page_id = last(link);
    const query = `{
      allPeopleByPage(page:${this.page_id}){
        count,
        next,
        previous,
          results {
            name,
            gender,
            mass,
            height,
            homeworld
  }
  }
  }`
    this.apollo.watchQuery({
      query: gql`${query}`,
    }).valueChanges.subscribe((result: any) => {
      console.log(result)
  this.people = result.data.allPeopleByPage.results;
  this.loading = result.loading;
  this.error = result.error; 
  this.count = result.data.allPeopleByPage.count;
  this.next = result.data.allPeopleByPage.next;
  this.previous = result.data.allPeopleByPage.previous;
});
  }

}
