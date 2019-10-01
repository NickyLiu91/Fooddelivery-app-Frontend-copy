# Food Delivery Frontend Application

### Installation

1. Clone a repository: 

   ```
   $ git clone https://git.syberry.com/jack-bao/food-delivery-frontend.git frontend
   ```

2. Run following commands:

   ```
   $ cd food-delivery-frontend
   $ yarn
   ```

3. Start the development server: 

   ```
   $ yarn start
   ```

### ESLint

The application follows the Airbnb's javascript styleguide https://github.com/airbnb/javascript

Before the deployment on servers all source code **should be** checked using the `.eslintrc` config (this command will fix all found errors that eslint is able to fix):

```
$ yarn lint
```

Add eslint check to pre-push git hook: go to `./.git/hooks/pre-push` and replace its content with `yarn lint` command.

To get the html-report of linter check use following command:

```
$ yarn lint-report
```

The html-report will be generated in the `./build/reports/eslint.html` file.
