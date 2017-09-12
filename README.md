# ElasticBenchmark

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2.

## Purpose

To benchmark elasticsearch search times with mock data.

In the future this test project will be expanded to use and benchmark webworkers for array rendering.

## Requirements

- Elasticsearch
- Angular CLI
- Node.js
- npm

## Installation

Download and install https://www.elastic.co/downloads/elasticsearch

Download and install Node.js and npm https://docs.npmjs.com/getting-started/installing-node

Download and install angular-cli https://cli.angular.io/

Clone this Github repo to your own computer.

Run elasticsearch from the file.

Navigate to project folder.

Run `ng serve --open` OR run `npm start` and navigate to http://localhost:4200/

## How to use

Under `src/app` you can find folder `mock_data`.

Copy / paste the json array into `src/app/services/mockdata.service` as a return value for getMockData() function.

Alternatively you can use the picture in `mock_data` folder to generate your own, much larger mock data file.

Make sure you change elasticsearch_api_url in `src/app/environments/environment.ts` to point to your own elasticserach api address.