import { Injectable } from '@angular/core';

@Injectable()
export class MockdataService {

    constructor() { }

    getMockData(): any[] {
        // Kopio json array mock_data kansiosta tähän jos haluat käyttää sitä.
        return [];
    }
}
