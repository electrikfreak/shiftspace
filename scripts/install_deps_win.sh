curl -O http://cloud.github.com/downloads/ShiftSpace/shiftspace/deps.tar.gz
tar xvzf deps.tar.gz
cd deps/CherryPy-3.1.2
python setup.py install
cd ../Routes-1.10.3
python setup.py install
cd ../httplib2-0.4.0
python setup.py install
cd ../simplejson-2.0.9
python setup.py install
cd ../CouchDB-0.6
python setup.py install
cd ../../
mv deps/couchdb-lucene-0.4-jar-with-dependencies.jar server/
mv deps/NaturalDocs-1.4 externals/
rm -rf deps
rm deps.tar.gz