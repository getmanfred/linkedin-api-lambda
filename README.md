# Linkedin API Lambda

This Lambda function processes requests to import LinkedIn profiles. It uses LinkedIn's [Member Data Portability (Member) API](https://learn.microsoft.com/en-us/linkedin/dma/member-data-portability/member-data-portability-member/?view=li-dma-data-portability-2024-08) to retrieve relevant profile data and returns a CV in [MAc format](https://github.com/getmanfred/mac).

_Note: This API is available only to LinkedIn users registered in the European Union._

![Flow](./assets/diagram.drawio.png)

# Environment variables

Environment variables must be defined in the .env file. The full list of environment variables can be found in [environment.ts](./src/util/environment.ts). Below, we highlight the most important variables for running local tests:

- `LOCAL_LINKEDIN_API_TOKEN=YOUR_LINKEDIN_API_TOKEN`: Your LinkedIn user token for easily testing this Lambda locally.
- `LOGGER_CONSOLE=true`: Enables the logger in a human-friendly format instead of JSON format.

## How to retrieve a valid Linkedin token

- `LOCAL_LINKEDIN_CLIENT_ID` and `LOCAL_LINKEDIN_CLIENT_SECRET` must be configured properly (see next section). Then type:

```bash
  yarn dev:token
```

And copy token value inside `LOCAL_LINKEDIN_CLIENT_SECRET` environment variable.

# How to develop

Follow these steps to set up the development environment and run essential tasks for the project:

- Install all dependencies using `nvm` and `yarn`:

  ```bash
    nvm use
    yarn install
  ```

- If you're part of Manfred's staff, download the necessary environment variables using [Doppler](https://www.doppler.com/):

  ```bash
    yarn dev:secrets
  ```

- Run the application locally with a fake sqs event. This uses the `LOCAL_PROFILE_API_TOKEN` environment variable to retrieve the LinkedIn profile (by default dev Manfred user):

  ```bash
    yarn dev
  ```

- If you need to get new API token:

  ```bash
    yarn dev:token
  ```

- Automatically lint the code and apply fixes to linting and formatting errors:

  ```bash
    yarn lint
  ```

- Execute the unit test suite to ensure that everything is working as expected:

  ```bash
    yarn test
  ```

- If you have `localstack` configured, you can send a real message to the queue, simulate its reception, and handle it with:

  ```bash
    yarn dev:consumer
  ```

Make sure you have all necessary environment variables and dependencies set up before running the tasks.

# References

- https://learn.microsoft.com/en-us/linkedin/dma/member-data-portability/member-data-portability-member
