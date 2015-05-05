#Start mongo
mongod --dbpath /Projects/siarest/data/

mongo
show dbs
use siarest
show collections
db.boards.find()
db.boards.drop()


#Raspberry
wget http://nodejs.org/dist/v0.10.2/node-v0.10.2.tar.gz
tar -xzf node-v0.10.2.tar.gz
cd node-v0.10.2
./configure
make
sudo make install

