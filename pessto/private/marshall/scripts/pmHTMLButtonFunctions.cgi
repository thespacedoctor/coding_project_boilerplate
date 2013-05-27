#!/usr/local/bin/python
# encoding: utf-8
"""
pmHTMLButtonFunctions.cgi

Created by David Young on August 8, 2012
If you have any questions requiring this script please email me: d.r.young@qub.ac.uk

dryx syntax:
xxx = come back here and do some more work
_someObject = a 'private' object that should only be changed for debugging

notes:
  - Dave started work on this file on August 8, 2012
  - This module will be added too as more buttons are added to the marshall
"""

# import sys
# import os

# ############################################
# # MAIN LOOP - USED FOR DEBUGGING           #
# ############################################
# def main():
#   import mtdx_mysql_dryx as m
#   import mtdx_logging_dryx as l


#   dbConnection = m.dbConnection('/pessto_marshall/settings/database_credentials.yaml')
#   logger = l.setup_dryx_logging('/pessto_marshall/settings/logging.yaml')

#   ## START LOGGING ##
#   logger.info('----- STARTING TO RUN THE TRANSIENTBUCKET FILLER -----')


#   ## WRITE CODE HERE


#   dbConnection.commit ()
#   dbConnection.close ()

#   ## FINISH LOGGING ##
#   logger.info('----- FINISHED ATTEMPT TO RUN THE TRANSIENTBUCKET FILLER -----')




# #############################################################################################
# # CLASSES                                                                                   #
# #############################################################################################

#   ** add class and/or functions here **


# ############################################
# # PUBLIC FUNCTIONS                         #
# ############################################




# ############################################
# # PRIVATE (HELPER) FUNCTIONS               #
# ############################################





# if __name__ == '__main__':
#   main()


"""
btnx_add_new_object.cgi

Created by David Young on 20120830.
If you have any questions requiring this script please email me: d.r.young@qub.ac.uk

dryx syntax:
p<Var> = variable formated in the way I want it output to file or screen
xxx = come back here and do some more work
qqq = left-off here

FILENAMES:
clsx : file containing classes
mtdx : file containing methods
dryx : file containing my base level classes/objects/frameworks - portable to other projects

"""

import sys
import os
import cgi
import MySQLdb as ms
import cgitb
import glob
import numpy
import datetime
import mtdx_pessto_marshall_common_methods as mpmcm
import mtdx_pessto_marshall_html_generator as mpmhg
import mtdx_pessto_marshall_query_generator as mpmqg
import clsx_pessto_marshall_mysql_queries as cpmmq
import clsx_pessto_marshall_html_blocks as cpmhb
import re
import utils as u
import bucketFiller
import pesstoObjects_sweeper_script as sweeper
import json
import time


def main():

	# SETUP AS JSON APP
	print "Content-type: application/json"
	print

	#ENABLE DEBUGGING
	#cgitb.enable()

	#GRAB ARGUMENTS
	fs = cgi.FieldStorage(keep_blank_values = True)

	db = cpmmq.connect_to_database()

	discDate = createdBy = hostRedshift = suggestedType = discoveryFilter = discoveryMag = mjd = dec = ra = objectImageUrl =objectUrl =survey = objectName = None

	# STRIP LEADING AND TRAILING WHITESPACE
	if(len(fs) != 0):

		try:
			for k in fs.keys():
				if isinstance(fs[k].value, basestring):
					fs[k].value = fs[k].value.strip()
		except:
			response={'browserAlert':'error in stripping leading/trailing whitespace from entered form values','dryerror':1}
			print(json.JSONEncoder().encode(response))
			sys.exit()

		try:
			objectName = fs['objectName'].value
			survey = fs['survey'].value
			objectUrl = fs['objectUrl'].value
			objectImageUrl = fs['objectImageUrl'].value
			ra = fs['ra'].value
			dec = fs['dec'].value
			discoveryMag = fs['discoveryMag'].value
			discoveryFilter = fs['discoveryFilter'].value
			mjd = fs['mjd'].value
			suggestedType = fs['suggestedType'].value
			hostRedshift = fs['hostRedshift'].value
			createdBy = fs['createdBy'].value
		except:
			response={'browserAlert':'error extracting form values','dryerror':1}
			print(json.JSONEncoder().encode(response))
			sys.exit()

		try:
			discDate = u.getDateFromMJD(float(mjd))
		except:
			response={'browserAlert':'error creating a date from mjd','dryerror':1}
			print(json.JSONEncoder().encode(response))
			sys.exit()


	if(objectName is None or objectName is ''):
		response={'browserAlert':'You have not given an object name','dryerror':1}
		print(json.JSONEncoder().encode(response))
		sys.exit()

	try:
		query = "INSERT INTO fs_user_added (candidateID,survey,objectUrl,targetImageUrl,ra_deg,dec_deg,discMag,mag,filter,observationMJD,discDate,suggestedType,hostZ,author,ingested,summaryRow,dateCreated,dateLastModified) VALUES ('"+objectName+"','"+survey+"','"+objectUrl+"','"+objectImageUrl+"','"+ra+"','"+dec+"','"+discoveryMag+"','"+discoveryMag+"','"+discoveryFilter+"','"+mjd+"','"+discDate+"','"+suggestedType+"','"+hostRedshift+"','"+createdBy+"',0,1,NOW(),NOW())"
		cursor=db.cursor(ms.cursors.DictCursor)
		cursor.execute(query)

		response={'browserAlert':'object has been added to the database','dryerror':0}
		print(json.JSONEncoder().encode(response))

	except ms.Error, e:
		errorString = "Something went wrong. Here's the mysql error:"+str(e)
		response={'browserAlert':errorString,'dryerror':1}
		print(json.JSONEncoder().encode(response))

		if e[0] == 1062: # Duplicate Key error
			#print e
			pass
		else:
			#print e
			pass

	time.sleep(1)

	bucketFiller.ingestUserAddedData(db)
	sweeper.sweep(db)



## MAIN HOOK ##
if __name__=="__main__":
    main()
