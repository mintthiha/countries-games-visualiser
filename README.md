# Web Project

**Country Info vs Game Types Visualizer**
Access here!:
http://3.97.8.77/
https://five20-project-pouliezos-wang-minthein-f022.onrender.com/


## Description
This web project done by Thiha Min Thein, Youran Wang and Nicholas Pouliezos is a web-based application that is using Steam's dataset on games and using Steam's API to get the live player counts for each game, while scrapping the games that do not have a player count.

## APIs Used
### Games Data
/api/countries-games/
/api/countries-games/detail/{countryName}
/api/countries-games/filter/{chart}/{name}

### Geojson 
/api/countries-geojson/

### World Data
/api/countries
/api/countries/detail/{countryName}
/api/countries/filter

## Usage
```
git clone https://gitlab.com/dawson-csy3-24-25/520/section1/teams/TeamI-13/520-project-pouliezos-wang-minthein
```

## How To Deploy
### AWS
1. Go to the AWS website and open lightsail and create instance
2. When creating instance choose node.js/bitnami blueprint
3. Create a ssh key to be able to access your lightsail instance
4. Use ```ssh -i 2024-520-yourname.pem bitnami@<instance ip>``` to access your instance
5. Use the folowing to zip and send the artifact from your device to the instance:
```
$ tar -czvf release-520-project-pouliezos-wang-minthein-Deployment-03071fc6.tar.gz artifact
$ scp -r -i 2023-520-yourname.pem <file_to_copy> bitnami@<aws instance ip>:~
```
( if this doesn't work try cloning the release branch and continue )
6. Start up the website using in the server directory(you can now use forever to manage the starting/restarting):
```
NODE_ENV=production PORT=3001 forever start bin/www
```
7. Configure a simple apache vhost.conf in /opt/bitnami/apache/conf/vhosts/vhost.conf to proxy 3001 to 80:
```
<VirtualHost 127.0.0.1:80 _default_:80>
  ProxyPass / http://localhost:3001/
  ProxyPassReverse / http://localhost:3001/
</VirtualHost>

```
8. Remember to add .env in the server directory with the mongodb connection string with a name ATLAS_URI= (if you need to reseed you can run util seeding script)
9. Restart apcahe:
```
sudo /opt/bitnami/ctlscript.sh restart apache
```
10. Check http://IPADDRESS !

### Render
1 Create an account using your GitLab
2 Select Web Service 
3 Select the Repository and branch you want to deploy
4 Build Command ```cd client && npm install && npm run build && cd ../server && npm install --production``` 
5 Start Command ```NODE_ENV=production cd server && node bin/www```
6 Set an evviroment variable where the Key is ```ATLAS_URI``` and the value is ur db string

## Attributions
https://www.kaggle.com/datasets/nelgiriyewithana/countries-of-the-world-2023

License for the country data source
https://creativecommons.org/licenses/by/4.0/

Link to Statista's original link as per their terms and services
https://www.statista.com/outlook/dmo/digital-media/video-games/worldwide

Plotly from 'plotly.js-basic-dist-min'

Link for the leaflet choropleth and code inspiration for CountryGeoJSON.jsx : https://leafletjs.com/examples/choropleth/

Link for the geoJson data : https://github.com/johan/world.geo.json/blob/master/countries.geo.json?short_path=afdfc39
