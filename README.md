# HCAR-Client-Database
## Team Members: Carson Gustafson, Justin Crittenden, Michael Goodwyn, Orlando Trujillo-Ortiz
Source code for HCAR Client Database.

Latest formal Documentation is located in the documents folder

Latest stable build code is in `main` branch, latest developmental build is in `dev` branch. Current features being 
worked on by developers can be found on their own branch, such as `orlando_dev` or `justin_dev`.

View the latest deployment via [this link.](https://hcar.trujillo-ortiz.com)

> [!NOTE]
> Note: The Cal Poly Humboldt DNS does not resolve the custom domain used. If on the campus network without a third-party DNS, use [this alternative link.](https://hcar-client-database-166569971807.us-west1.run.app)

# Table of Contents
1. [Build Instructions](#build-instructions)
2. [Unit Testing](#unit-testing)
   1. [Running Tests in WebStorm](#running-tests-in-webstorm)
3. [Integration Testing](#integration-testing)
4. [Coverage Report](#coverage-report)

# Build Instructions
1. Clone our latest `dev`(latest code) or `main`(stable code) branch from our [repository](https://github.com/Trujillo707/HCAR-Client-Database.git).
```
   git clone --branch <branchName> https://github.com/Trujillo707/HCAR-Client-Database.git
```
2. Install project dependencies from our `package.json`
```
  npm install
```
---
# Unit Testing
Due to this project using ECMAScript Modules, Jest requires some additional setup.
Fortunately, most of this is remedied by the provided `Code/jest.config.mjs` and `Code/package.json` files in the
repository.

To run all unit test suites, you can simply do the following in the terminal:
```
  npm test
```

This uses the value for "test" in `package.json`, which just provides preconfigured arguments that *should* work.

Of course, you can run just a particular suite(s) with either of the three options:
1. Using the default regex handling with no flags  
    ```
    npm test <pattern>
    ```
   * As expected, it'll just search for tests in **test** files that match the given pattern(s).
   * For example, `npm test foo` will search for files like `foo.test.js` or `foo2.test.js` and execute the tests within 
said files. 
2. Using the `--findRelatedTests` flag    
   ```
   npm test --findRelatedTests <space delimited arguments here>
   ```
   * This aforementioned flag will pattern match tests to **source code files** provided in a space delimited list of arguments.
   * For example, `npm test foo.js` will try to find any tests that relate to code within foo.js
3. Using the `-t` flag  
    ```
    npm test -t=<regex>
    ```
   * This aforementioned tag will use regex to match unit tests by their name or the name of the `describe()` block they 
are wrapped in. It is not limited by file so it'll search for that pattern in all tests!

## Running Tests in WebStorm
Initial attempts to run the tests might result in an error message that suggests you read up on setting up Jest to work 
with ECMAScript Modules, but do not worry.
Go to the Run configuration (the dropdown next to the run button) and choose "Edit Configurations".
For each seemingly faulty configuration, add the follwing:
1. Set "Configuration File" to the relative path of your `jest.config.mjs` file
2. Set "Node options" to include the flag `--experimental-vm-modules`

This should be enough to get your Jest up and running.

---
# Integration Testing
> [!CAUTION]
> This projects integration tests do in fact send queries to external APIs, so take care in deciding when it is appropriate
> to run them manually. 
> Otherwise, tests categorized as integration tests will be performed automatically during CI.

If you decide to run these tests, there is a provided script in `package.json` that you can call as follows:
``` 
   npm run integration
```
This will run both unit and integration tests with the default settings in `jest.config.mjs`. Due to the nature of 
calling external APIs, integration test suites will take longer to execute. If needed, consider implementing timeouts 
in your written integration tests if you want to deem stalls as failures. 

---
# Coverage Report
If you run Jest from the CLI, you will observe that you got a coverage folder in your project directory.
Upon successful test runs (where Jest doesn't crash), Jest will generate a nice HTML document to view test results.
It's pretty neat and is more useful than default IDE code reports in my opinion.
There is really no point in adding it to Git, so no need to commit these reports.
