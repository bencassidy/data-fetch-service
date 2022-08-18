## Description

Service to fetch and store data from a submitted url. Utilizes a worker queue to manage data processing.

## Routes

Create a data fetch job

```
POST /jobs
{
  url: string
}
```

Check a job's status

```
GET /jobs/:id/status
```

Check a job's results

```
GET /jobs/:id/results
```

Delete a job

```
DELETE /jobs/:id
```

## Installation

Clone this repository and run `npm install`

#### Install and configure redis

```bash
$ docker pull redis
$ docker run -d --rm -p 6379:6379 <image id>
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
