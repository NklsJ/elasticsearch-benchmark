import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';

@Injectable()
export class ElasticsearchService {
    readonly elasticsearch_api_url: string;

    constructor(
        private http: Http
    ) {
        this.elasticsearch_api_url = environment.elasticsearch_api_url;
    }

    public addIndex( values: object ): Observable<any> {
        return this.http.post(this.elasticsearch_api_url + '/persons/customer', JSON.stringify(values), { headers: new Headers() } )
            .map( (response: Response) => {
                console.log( response );
                return response.json();
            });
    }

    public bulkAddIndex( values: object[] ): Observable<any> {
        let bulkString = '';
        let i = values.length;
        while (i--) {
            bulkString += '{ "index" : { "_index" : "persons", "_type" : "customer" } }\n';
            bulkString += JSON.stringify(values[i]) + '\n';
        }
        return this.http.post(this.elasticsearch_api_url + '/_bulk', bulkString, { headers: new Headers() } )
            .map( (response: Response) => {
                return response.json();
            });
    }

    public inputSearch( input: string ): Observable<any> {
        const query = {
            'sort' : [
                { '_score' : 'asc' }
            ],
            'min_score': 2.0,
            'query': {
                'multi_match': {
                    'fields':  [ 'name', 'city', 'country', 'email' ],
                    'query':     input,
                    'fuzziness': 1
                }
            }
        };

        return this.http.post(this.elasticsearch_api_url + '/persons/_search?size=10000', query, { headers: new Headers() } )
            .map( (response: Response) => {
                console.log( response.json() );
                return response.json();
            });
    }

    public tableSearch( name: string, city: string, country: string, email: string ): Observable<any> {
        const query = {
            'sort' : [
                { '_score' : 'asc' }
            ],
            'query': {
                'bool' : {
                    'must' : [
                    // { "term" : { "tag" : "wow" } },
                    // { "term" : { "tag" : "elasticsearch" } }
                  ],
                }
              }
        };

        if ( name != '' ) {
            query['query']['bool']['must'].push( { 'fuzzy' : {
                'name' : {
                    'value' : name,
                    'fuzziness' : 1
                }
            } } );
        }
        if ( city != '' ) {
            query['query']['bool']['must'].push( { 'fuzzy' : {
                'name' : {
                    'value' : city,
                    'fuzziness' : 5
                }
            } } );
        }
        if ( country != '' ) {
            query['query']['bool']['must'].push( { 'fuzzy' : {
                'name' : {
                    'value' : country,
                    'fuzziness' : 2
                }
            } } );
        }
        if ( email != '' ) {
            query['query']['bool']['must'].push( { 'multi_match' : {
                'query' : email,
                'fields' : [ 'email' ],
                'analyzer' : 'simple'
            } } );
        }

        console.log( query );

        return this.http.post(this.elasticsearch_api_url + '/persons/_search?size=10000', query, { headers: new Headers() } )
        .map( (response: Response) => {
            console.log( response.json() );
            return response.json();
        });
    }

    public readIndices(): Observable<any> {
        const query = {
            'query' : {
                'match_all' : { },
            }
        };

        // TODO: debugia varten size=10000, ota pois tarvittaessa.
        return this.http.post(this.elasticsearch_api_url + '/persons/customer/_search?size=10000', query, { headers: new Headers() } )
            .map( (response: Response) => {
                console.log( response.json() );
                return response.json();
            });
    }

    public searchIndex() {

    }

    /*
    private createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('currentToken'));
    }
    */
}
