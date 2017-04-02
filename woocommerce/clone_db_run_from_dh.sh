#!/bin/bash

#
# ./cloneDb.sh -b tst2 -u http://low.la:8092 -d 'a new desc' -dn wp_db_01 -p 8092
#
#  sudo docker run --name wordpress_wp_db_03 -e WORDPRESS_DB_HOST=rds-mysql-wp.cyclravwyw6n.us-east-1.rds.amazonaws.com -e WORDPRESS_DB_USER=user -e WORDPRESS_DB_PASSWORD=pass123456 -e WORDPRESS_DB_NAME=wp_db_03 -p 8092:80 wordpress


HELP_MSG="the help msg here"
DUMMY_DB="vanila_wp_wc"
IMAGE_SOURCE="lowla/wordpress:v0.0.1"
BLOGNAME=""
DESCRIPTION=""
NEW_DB_NAME=""
SITE_URL=""


DBUSER=user
DBPASSWORD=pass123456
DBSERVER=rds-mysql-wp.cyclravwyw6n.us-east-1.rds.amazonaws.com
# DUMMY_DB=_wordpress_4

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
     -h|--help)
    echo $HELP_MSG
    exit
    ;;
    -b|--blogname)
    BLOGNAME="$2"
    shift # past argument
    ;;
    -u|--siteurl)
    SITE_URL="$2"
    shift # past argument
    ;;
    -d|--blogdescription)
    DESCRIPTION="$2"
    shift # past argument
    ;;
    -dn|--dbname)
    NEW_DB_NAME="$2"
    shift # past argument
    ;;
    -p|--port)
    PORT="$2"
    shift # past argument
    ;;

    --default)
    DEFAULT=YES
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

echo BLOGNAME = "${BLOGNAME}"
echo DESCRIPTION = "${DESCRIPTION}"
echo NEW_DB_NAME = "${NEW_DB_NAME}"
echo SITE_URL = "${SITE_URL}"

# Done getting valuse from input.


echo duplicating DB:

fCreateTable=""
fInsertData=""
echo "Copying database ... (may take a while ...)"
DBCONN="-h ${DBSERVER} -u ${DBUSER} --password=${DBPASSWORD}"
#
# add exit if exist
#
echo "DROP DATABASE IF EXISTS ${NEW_DB_NAME}" | mysql ${DBCONN}
echo "CREATE DATABASE ${NEW_DB_NAME}" | mysql ${DBCONN}
for TABLE in `echo "SHOW TABLES" | mysql $DBCONN $DUMMY_DB | tail -n +2`; do
        echo "creating table ${TABLE}"
        createTable=`echo "SHOW CREATE TABLE ${TABLE}"|mysql -B -r $DBCONN $DUMMY_DB|tail -n +2|cut -f 2-`
        fCreateTable="${fCreateTable} ; ${createTable}"
        insertData="INSERT INTO ${NEW_DB_NAME}.${TABLE} SELECT * FROM ${DUMMY_DB}.${TABLE}"
        fInsertData="${fInsertData} ; ${insertData}"
done;
echo "$fCreateTable ; $fInsertData" | mysql $DBCONN $NEW_DB_NAME

echo update new db fields:
echo set BlogName to: "${BlogName}"
mysql $DBCONN --database="${NEW_DB_NAME}" --execute="update wp_options SET option_value='"${BLOGNAME}"' where option_name='blogname';"
echo set Site URL to: "${SITE_URL}"
mysql $DBCONN --database="${NEW_DB_NAME}" --execute=" update wp_options SET option_value='"${SITE_URL}"' where option_name='siteurl';"
echo set DESCRIPTION to: "${DESCRIPTION}"
mysql $DBCONN --database="${NEW_DB_NAME}" --execute=" update wp_options SET option_value='"${DESCRIPTION}"' where option_name='blogdescription';"
echo set siteurl to: "${SITE_URL}"
mysql $DBCONN --database="${NEW_DB_NAME}" --execute=" update wp_options SET option_value='"${SITE_URL}"' where option_name='home';"

echo running: docker run --name wordpress"${NEW_DB_NAME}" -e WORDPRESS_DB_HOST="${DBSERVER}" -e WORDPRESS_DB_USER="${DBUSER}" -e WORDPRESS_DB_PASSWORD="${DBPASSWORD}" -e WORDPRESS_DB_NAME="${NEW_DB_NAME}" -p "${PORT}":80 wordpress
sudo docker run -itd --name wordpress"${NEW_DB_NAME}" -e WORDPRESS_DB_HOST="${DBSERVER}" -e WORDPRESS_DB_USER="${DBUSER}" -e WORDPRESS_DB_PASSWORD="${DBPASSWORD}" -e WORDPRESS_DB_NAME="${NEW_DB_NAME}" -p "${PORT}":80 "${IMAGE_SOURCE}"

sudo docker start wordpress"${NEW_DB_NAME}"
