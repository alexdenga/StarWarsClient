import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Apollo, gql} from 'apollo-angular';
import { People } from '../resources/models';@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  loading: boolean = true;
  error: string = '';
  gender: People[] = [];
  mass: People[] = [];
  height: People[] = [];
  homeworld: People[] = [];
  name: People[] = [];
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      const query = `{
        personDetails(search: "${params.name}"){
                results {
                  name,
                  gender,
                  mass,
                  height,
                  homeworld
      }
      }
      }`;
      this.apollo.watchQuery({query: gql`${query}`,
  }).valueChanges.subscribe((result: any) => {
    this.loading = result.loading;
    this.error = result.error; 
    this.gender = result.data.personDetails.results[0].gender;
    this.mass = result.data.personDetails.results[0].mass;
    this.height = result.data.personDetails.results[0].height;
    this.homeworld = result.data.personDetails.results[0].homeworld;
  });
    }
  );
  }

}
