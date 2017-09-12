import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/Rx';

import { ElasticsearchService } from '../services/elasticsearch.service';
import { MockdataService } from '../services/mockdata.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: [
        '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
        './landing.component.scss'
    ],
    providers: [
        ElasticsearchService,
        MockdataService
    ]
})
export class LandingComponent implements OnInit {
    public personForm: FormGroup;
    public searchForm: FormGroup;
    public formMessage: string;

    public persons: any[] = [];

    public inputString: string;

    public showTook: boolean;
    public took: string;
    public showLoopTook: boolean;
    public loopTook: string;
    public showHits: boolean;
    public hits: number;
    public showBulkTook: boolean;
    public bulkTook: string;

    public nameInput = new FormControl('');
    public cityInput = new FormControl('');
    public countryInput = new FormControl('');
    public emailInput = new FormControl('');

    constructor(
        private elasticsearchService: ElasticsearchService,
        private mockdataService: MockdataService
    ) {
        this.inputString = '';
        this.showTook = false;
        this.took = '';
        this.showLoopTook = false;
        this.loopTook = '';
        this.showHits = false;
        this.hits = 0;
        this.showBulkTook = false;
        this.bulkTook = '';

        this.personForm = new FormGroup ({
            name: new FormControl('', [Validators.required, Validators.minLength(2)]),
            city: new FormControl('', Validators.required),
            country: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.minLength(2), Validators.email]),
        });
    }

    ngOnInit() {
        this.nameInput.valueChanges.debounceTime(500).subscribe((nameInput: string) => {
            this.nameInput.setValue( nameInput );
            this.tableSearch();
        });
        this.cityInput.valueChanges.debounceTime(500).subscribe((cityInput: string) => {
            this.cityInput.setValue( cityInput );
            this.tableSearch();
        });
        this.countryInput.valueChanges.debounceTime(500).subscribe((countryInput: string) => {
            this.countryInput.setValue( countryInput );
            this.tableSearch();
        });
        this.emailInput.valueChanges.debounceTime(500).subscribe((emailInput: string) => {
            this.emailInput.setValue( emailInput );
            this.tableSearch();
        });
    }

    addElasticsearchIndex(): void {
        if ( this.personForm.valid ) {
            const values = this.personForm.value;
            this.elasticsearchService.addIndex( values )
                .subscribe(
                    result => {
                        // success
                        this.persons.unshift({
                            'name': values.name,
                            'city': values.city,
                            'country': values.country,
                            'email': values.email,
                        });
                        this.personForm.reset();
                    },
                    err => {
                        console.log('Error: %s', err);
                    }
                );
        } else {
            this.formMessage = 'Täytä kaikki vaaditut kentät!';
        }
    }

    inputSearch( value: string ): void {
        this.inputString = value;
        this.elasticsearchService.inputSearch( this.inputString )
            .subscribe(
                result => {
                    // success
                    console.log('returni');

                    if ( result.took > -1 ) {
                        this.createPersonsArray( result.hits.hits );
                    }
                },
                err => {
                    console.log('Error: %s', err);
                }
            );
    }

    /* TODO:
     *  - nameInput         (DONE)
     *  - cityInput
     *  - countryInput
     *  - emailInput
     */
    tableSearch(): void {
        console.log( this.nameInput.value );
        console.log( this.cityInput.value );
        console.log( this.countryInput.value );
        console.log( this.emailInput.value );

        if (
            this.nameInput.value != '' ||
            this.cityInput.value != '' ||
            this.countryInput.value != '' ||
            this.emailInput.value != ''
        ) {
            this.elasticsearchService.tableSearch(
                    this.nameInput.value,
                    this.cityInput.value,
                    this.countryInput.value,
                    this.emailInput.value
                )
                .subscribe(
                    result => {
                        // success
                        if ( result.took > -1 ) {
                            this.createPersonsArray( result.hits.hits );
                        }
                    },
                    err => {
                        console.log('Error: %s', err);
                    }
                );
        } else {
            this.createPersonsArray( [] );
        }
    }

    readElasticsearchIndices( input: string ): void {
        this.elasticsearchService.readIndices()
            .subscribe(
                result => {
                    // success
                    if ( result.took > -1 ) {
                        this.showTook = true;
                        this.took = Number(result.took / 1000).toFixed(3);

                        this.showHits = true;
                        this.hits = result.hits.total;

                        this.createPersonsArray( result.hits.hits );
                    }
                },
                err => {
                    console.log('Error: %s', err);
                }
            );
    }

    bulkAddElasticsearchIndex(): void {
        /*
        ÄLÄ KÄYTÄ WEBWORKERIN KANSSA
        console.log( window );
        if( confirm('Oletko varma? Tämä prosessi voi kestää useita sekunteja.') ) {
            console.log( 'jep' );
        }
        else{
            console.log( 'eieiei' );
        }
        */

        const t0 = performance.now();
        const bulkData = this.mockdataService.getMockData();

        this.elasticsearchService.bulkAddIndex( bulkData )
            .subscribe(
                function (result) {
                    // success
                    const t1 = performance.now();
                    this.bulkTook = Number(t1 - t0).toFixed(3);
                    this.showBulkTook = true;
                },
                function (err) {
                    console.log('Error: %s', err);
                }
            );
    }

    createPersonsArray( hits: any[] ): void {
        const t0 = performance.now();
        let i = hits.length;
        this.persons = [];
        while (i--) {
            this.persons.push({
                'name': hits[i]._source.name,
                'city': hits[i]._source.city,
                'country': hits[i]._source.country,
                'email': hits[i]._source.email,
            });
        }
        const t1 = performance.now();
        this.loopTook = Number(t1 - t0).toFixed(3);
        this.showLoopTook = true;
    }
}
