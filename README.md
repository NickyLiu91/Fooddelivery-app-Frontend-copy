# Food Delivery Frontend Application

### Environment variables

| Environment Variable                | Example of value                                       | Description                                            |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| REACT_APP_API_URL                   | https://food-delievery-api.com/api/v1                  | API Url                                                |
| REACT_APP_SOCKET_URL                | https://food-delievery-socket.com/api/v1               | Socket Url                                             |
| REACT_APP_GOOGLE_MAPS_API_KEY       | AIzaSsaD2as7TaJfs-rmA-zUkr091231l7h                    | Google maps API key                                    |
| NODE_PATH                           | src/                                                   | Source root path to enable absolute paths in imports   |


### Installation

1. Clone a repository: 

   ```
   $ git clone https://git.syberry.com/jack-bao/food-delivery-frontend.git frontend
   ```

2. Run following commands:

   ```
   $ cd food-delivery-frontend
   $ npm i
   ```

3. Start the development server: 

   ```
   $ npm run start
   ```
   
4. Set line separators
   1. Set line separator in IDE to `\n`.<br>
      Ex. for PhpStorm/WebStorm set `Editor | Code Style | Line separator` to `Unix and OS X (\n)`
   2. Set line separator in Git by command `git config core.autocrlf input`
   
5. Configure absolute paths in project
   1. Add `NODE_PATH=src/` to `.env` file
   2. PhpStorm/Webstorm: Right-click on `src` folder and choose `Mark Directory As | Resource Root`
   3. PhpStorm/Webstorm: go to `Settings | Editor | Code Style | JavaScript`, choose `Imports` tab and tick `Use paths relative to the project, resource or sources roots`

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

### Store migrations

Redux store is partially persisted in local storage. To prevent collisions and errors, new migration must be created every time when:
1. New permissions are implemented;
2. Store structure is changed.

Migrations config file: `./src/reducers/storeMigrations.js`
# Fooddelivery-app-Frontend-copy
# Fooddelivery-app-Frontend-copy
# Fooddelivery-app-Frontend-copy
