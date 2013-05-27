#!/usr/local/bin/python
# encoding: utf-8
"""
pesstoMarshallButtons
=====================
:Summary:
	The functions behind the various buttons on the PESSTO Marshall web-interface.

:Author:
	David Young

:Date Created:
	August 8, 2012

:dryx syntax:
	- ``xxx`` = come back here and do some more work
	- ``_someObject`` = a 'private' object that should only be changed for debugging

:Notes:
	- If you have any questions requiring this script please email me: d.r.young@qub.ac.uk
"""
################# GLOBAL IMPORTS ####################
import sys
import os

######################################################
# MAIN LOOP - USED FOR DEBUGGING OR WHEN SCRIPTING   #
######################################################
def main():

	################ > IMPORTS ################
	## STANDARD LIB ##
	import cgitb
	import cgi
	## THIRD PARTY ##
	## LOCAL APPLICATION ##
	import pesstoMarshallPythonPath as pp
	pp.set_python_path()
	import pesstoMarshallCommonUtils as p


	################ > SETUP ##################
	## SETUP DB CONNECTION AND A LOGGER
	dbConn, log = p.settings()
	## START LOGGING ##
	log.info('----- STARTING TO RUN THE pesstoMarshallButtons -----')

	################ > VARIABLE SETTINGS ######
	################ >ACTION(S) ###############
	print "Content-type: application/json"  # SETUP AS JSON WEBAPP
	fs = cgi.FieldStorage(keep_blank_values = True)  # GRAB ARGUMENTS
	cgitb.enable()    # ENABLE DEBUGGING

	if(len(fs) != 0):
		try:
			log.debug("attempting to strip the whitespace from the URL arugments")
			for k in fs.keys():
				if isinstance(fs[k].value, basestring):
					fs[k].value = fs[k].value.strip()
		except Exception, e:
			log.critical("could not strip the whitespace from the URL arugments - failed with this error: %s " % (str(e),))
			# response={'browserAlert':'error in stripping leading/trailing whitespace from entered form values','dryerror':1}
			# print(json.JSONEncoder().encode(response))
			# sys.exit()

	if(len(fs) != 0):
		paras = fs
		#del paras['button']
		if(fs['button'].value == 'classify_object'):
			try:
				log.debug("attempting to add classification data to the database")
				classify_object(dbConn, log, paras)
			except Exception, e:
				log.error("could not add classification data to the database - failed with this error: %s " % (str(e),))
				return -1
		elif(fs['button'].value == 'create_new_ticket'):
			try:
				log.debug("attempting to add a new object to the database")
				create_new_ticket(dbConn, log, paras)
			except Exception, e:
				log.critical("could not add a new object to the database - failed with this error: %s " % (str(e),))
				return -1
		elif(fs['button'].value == 'add_object_comment'):
			try:
				log.debug("attempting to add a new comment to the database")
				add_object_comment(dbConn, log, paras)
			except Exception, e:
				log.critical("could not add a new comment to the database - failed with this error: %s " % (str(e),))
				return -1
		elif(fs['button'].value == 'change_mwf_flag'):
			try:
				log.debug("attempting to change the marshall workflow flag")
				change_mwf_flag(dbConn, log, paras)
			except Exception, e:
				log.error("could not change the marshall workflow flag - failed with this error: %s " % (str(e),))
				return -1
		elif(fs['button'].value == 'change_awf_flag'):
			try:
				log.debug("attempting to change the alert workflow flag")
				change_awf_flag(dbConn, log, paras)
			except Exception, e:
				log.error("could not change the alert workflow flag - failed with this error: %s " % (str(e),))
				return -1

	dbConn.commit()
	dbConn.close()
	## FINISH LOGGING ##
	log.info('----- FINISHED ATTEMPT TO RUN THE pesstoMarshallButtons -----')
	return

#############################
# CLASSES                   #
#############################

############################################
# PUBLIC FUNCTIONS                         #
############################################
## LAST MODIFIED : December 10, 2012
## CREATED : December 10, 2012
## AUTHOR : DRYX
def classify_object(dbConn, log, paras):
	"""Function linked to the *classify* button on the pessto marshall.

	**Key Arguments:**
		- ``dbConn`` -- mysql database connection
		- ``log`` -- logger
		- ``paras`` -- parameters passed via the URL

	**Return:**
		- ``None``
	"""
	################ > IMPORTS ################
	import dryxCommonUtils as cu
	import dryxAstroTools as at
	import dryxMySQL as m
	import utils as u
	import json
	import re
	import pesstoMarshallMySQL as pm
	import pesstoMarshallSweeper as ps

	################ > VARIABLE SETTINGS ######
	pesstoObjectsId = None
	objectName = None
	source = None
	atelNumber = None
	cbetNumber = None
	mjd = None
	telescope = None
	instrument = None
	ttype = None
	classification = None
	redshift = None
	reducer = None
	awfFlag = None
	mwfFlag = None

	################ >ACTION(S) ################
	# try:
	#   log.debug("attempting to parse the URL arguments to strip any whitespace")
	#   paras = cu.strip_whitespace_from_dictionary_values(log,paras)
	# except Exception, e:
	#   log.critical("could not parse the URL arguments to strip any whitespace - failed with this error: %s " % (str(e),))
	#   return -1

	## EXTRACT VARIABLES FROM FIELD-STORAGE
	n = lambda x: paras[x].value
	try:
		log.debug("attempting to extract the parameters from the URL")
		pesstoObjectsId = n('pesstoObjectsId')
		objectName = n('objectName')
		source=n('source')
		atelNumber=n('atelNumber')
		cbetNumber=n('cbetNumber')
		mjd=n('mjd')
		telescope=n('telescope')
		instrument=n('instrument')
		ttype=n('type')
		classification=n('classification')
		redshift=n('redshift')
		reducer=n('reducer')
		awfFlag=n('awfFlag')
		mwfFlag=n('mwfFlag')
	except Exception, e:
		log.critical("could not extract the parameters from the URL - failed with this error: %s " % (str(e),))
		return -1

	## MAKE  SURE WE HAVE A CLASSIFICATION VALUE
	if(classification == None):
		classification = ttype

	## SET ATEL AND CBET URLS
	if(atelNumber!=None):
		surveyObjectUrl = 'http://www.astronomerstelegram.org/?read='+atelNumber
	elif(cbetNumber!=None):
		try:
			log.debug("attempting to generate cbet url for cbet %s" % (cbetNumber,))
			surveyObjectUrl = at.create_cbet_url(dbConn, log, cbetNumber)
		except Exception, e:
			log.error("could not generate cbet url for cbet %s - failed with this error: %s " % (cbetNumber,str(e),))
			return -1
	else:
		surveyObjectUrl = None

	try:
		log.debug("attempting to calculate a date from an MJD")
		obsDate = u.getDateFromMJD(float(mjd))
	except Exception, e:
		log.error("could not calculate a date from an MJD - failed with this error: %s " % (str(e),))
		return -1

	sqlQuery = """INSERT INTO transientBucket
						(transientBucketId,name,survey,surveyObjectUrl,observationMJD,observationDate,telescope,instrument,spectralType,transientRedshift,reducer,dateCreated,dateLastModified)
						VALUES (%s,'%s','%s','%s',%s,'%s','%s','%s','%s',%s,'%s',NOW(),NOW())""" % (pesstoObjectsId,objectName,source,surveyObjectUrl,mjd,obsDate,telescope,instrument,classification,redshift,reducer,)

	try:
		log.debug("attempting to add a classification for *transientObjectId* %s into the ``transientBucket`` db table")
		m.execute_mysql_write_query(sqlQuery,dbConn, log)
	except Exception, e:
		log.error("could not add a classification for *transientObjectId* %s into the ``transientBucket`` db table - failed with this error: %s " % (transientObjectId,str(e),))
		return -1

	sqlQuery = """UPDATE pesstoObjects
							set classifiedFlag = 1
							where pesstoObjectsId = %s""" % (pesstoObjectsId,)
	try:
		log.debug("attempting to update the classification flag for pesstoObjectsId %s" % (pesstoObjectsId,))
		m.execute_mysql_write_query(sqlQuery,dbConn, log)
		## PRINT A SUCCESS MESSAGE VIA JSON
		response={'browserAlert':'classification has been added to the database','dryerror':0}
		print(json.JSONEncoder().encode(response))
	except Exception, e:
		log.error("could not update the classification flag for pesstoObjectsId %s - failed with this error: %s " % (pesstoObjectsId,str(e),))
		return -1

	if (re.search('^[0-9]', pesstoObjectsId)):
		## CHANGE FLAGS
		try:
			log.debug("attempting to update the alert workflow location for pesstoObjectsId %s" % (pesstoObjectsId,))
			pm.change_pesstoObjects_flag(dbConn, log, pesstoObjectsId,'alertWorkflowLocation',awfFlag)
			pm.change_pesstoObjects_flag(dbConn, log, pesstoObjectsId,'marshallWorkflowLocation',mwfFlag)
		except Exception, e:
			log.error("could not update the alert workflow location for pesstoObjectsId %s - failed with this error: %s " % (pesstoObjectsId,str(e),))
			return -1

	try:
		log.debug("attempting to run the pesstoMarshallSweeper script")
		ps.sweep(dbConn,log)
	except Exception, e:
		log.critical("could not run the pesstoMarshallSweeper script - failed with this error: %s " % (str(e),))
		return -1

	return None

## LAST MODIFIED : January 2, 2013
## CREATED : January 2, 2013
## AUTHOR : DRYX
def create_new_ticket(dbConn, log, paras):
	"""Create a new PESSTO object ticket.

	**Key Arguments:**
		- ``dbConn`` -- mysql database connection
		- ``log`` -- logger
		-

	**Return:**
		- ``None``
	"""
	################ > IMPORTS ################
	## STANDARD LIB ##
	import sys
	import os
	import time
	## THIRD PARTY ##
	import json
	## LOCAL APPLICATION ##
	import dryxCommonUtils as cu
	import dryxAstroTools as at
	import dryxMySQL as m
	import utils as u
	import bucketFiller
	import pesstoMarshallSweeper as sweeper

	################ > VARIABLE SETTINGS ######
	discDate = createdBy = hostRedshift = suggestedType = discoveryFilter = discoveryMag = mjd = dec = ra = objectImageUrl =objectUrl =survey = objectName = None

	## EXTRACT VARIABLES FROM FIELD-STORAGE
	#paras = cu.strip_whitespace_from_dictionary_values(log,paras)
	#log.debug('paras: %s' % (type(paras),))
	n = lambda x: paras[x].value
	try:
		log.debug("attempting to parse the URL values passed to the 'create new object' script into python parameters")
		objectName = n('objectName')
		survey = n('survey')
		objectUrl = n('objectUrl')
		objectImageUrl = n('objectImageUrl')
		ra = n('ra')
		dec = n('dec')
		discoveryMag = n('discoveryMag')
		discoveryFilter = n('discoveryFilter')
		mjd = n('mjd')
		suggestedType = n('suggestedType')
		hostRedshift = n('hostRedshift')
		createdBy = n('createdBy')
	except Exception, e:
		log.critical("could not parse the URL values passed to the 'create new object' script into python parameters - failed with this error: %s " % (str(e),))
		response={'browserAlert':'error extracting form values','dryerror':1}
		print(json.JSONEncoder().encode(response))
		sys.exit()

	try:
		log.debug("attempting to get the date from the MJD")
		discDate = u.getDateFromMJD(float(mjd))
	except Exception, e:
		log.critical("could not get the date from the MJD - failed with this error: %s " % (str(e),))
		response={'browserAlert':'error creating a date from mjd','dryerror':1}
		print(json.JSONEncoder().encode(response))
		sys.exit()

	sqlQuery = """INSERT INTO fs_user_added
									(candidateID,
										survey,
										objectUrl,
										targetImageUrl,
										ra_deg,
										dec_deg,
										discMag,
										mag,
										filter,
										observationMJD,
										discDate,
										suggestedType,
										hostZ,
										author,
										ingested,
										summaryRow,
										dateCreated,
										dateLastModified)
									VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s',0,1,NOW(),NOW())""" % (objectName,
																														survey,
																														objectUrl,
																														objectImageUrl,
																														ra,
																														dec,
																														discoveryMag,
																														discoveryMag,
																														discoveryFilter,
																														mjd,
																														discDate,
																														suggestedType,
																														hostRedshift,
																														createdBy)

	try:
		log.debug("attempting to add the object to the database")
		m.execute_mysql_write_query(sqlQuery,dbConn, log)
		response={'browserAlert':'object has been added to the database','dryerror':0}
		print(json.JSONEncoder().encode(response))
	except Exception, e:
		log.error("could not add the object to the database - failed with this error: %s " % (str(e),))
		response={'browserAlert':errorString,'dryerror':1}
		print(json.JSONEncoder().encode(response))
		return -1

	time.sleep(1)

	try:
		log.debug("attempting to run the bucketFiller script")
		bucketFiller.ingestUserAddedData(dbConn)
	except Exception, e:
		log.critical("could not run the bucketFiller script - failed with this error: %s " % (str(e),))
		return -1

	try:
		log.debug("attempting to run the sweeper script")
		sweeper.sweep(dbConn,log)
	except Exception, e:
		log.critical("could not run the sweeper script - failed with this error: %s " % (str(e),))
		return -1

	return

## LAST MODIFIED : January 7, 2013
## CREATED : January 7, 2013
## AUTHOR : DRYX
def add_object_comment(dbConn, log, paras):
	"""Receives parameters from the comment forms on the pessto marshall and appends a comment to the ``pesstoObjectsComments`` table.

	**Key Arguments:**
		- ``dbConn`` -- mysql database connection
		- ``log`` -- logger
		- ``paras`` -- FieldStorage parameters passed via the URL

	**Return:**
		- None
	"""
	################ > IMPORTS ################
	## STANDARD LIB ##
	import sys
	import os
	## LOCAL APPLICATION ##
	import pesstoMarshallHTMLFramework as phf
	import pesstoMarshallMySQL as pm
	import dryxMySQL as m

	################ > VARIABLE SETTINGS ######
	transientBucketId = paras['pesstoObjectsId'].value
	author = paras['author'].value
	comment = paras['comment'].value

	################ >ACTION(S) ################
	try:
		log.debug("attempting to add a comment to the pessto marshall database")
		pm.add_object_comment(dbConn, log, transientBucketId, author, comment)
	except Exception, e:
		log.error("could not add a comment to the pessto marshall database - failed with this error: %s " % (str(e),))
		return -1

	return


## LAST MODIFIED : January 7, 2013
## CREATED : January 7, 2013
## AUTHOR : DRYX
def change_mwf_flag(dbConn, log, paras):
	"""Change the ``MarshallWorkflowLocation`` flag for a give pesstoObject

	**Key Arguments:**
		- ``dbConn`` -- mysql database connection
		- ``log`` -- logger
		- ``params`` -- FieldStorage parameters passed via the URL

	**Return:**
		- None
	"""
	################ > IMPORTS ################
	## STANDARD LIB ##
	import sys
	import os
	import re
	## THIRD PARTY ##
	import json
	## LOCAL APPLICATION ##
	import pesstoMarshallHTMLFramework as phf
	import pesstoMarshallMySQL as pm
	import dryxMySQL as m

	################ > VARIABLE SETTINGS ######
	n = lambda x: paras[x].value
	try:
		log.debug("attempting to parse the URL values passed to the name of script script into python parameters")
		pesstoObjectsId = n('pesstoObjectsId')
		mwfFlag = n('mwfFlag')
	except Exception, e:
		log.critical("could not parse the URL values passed to the name of script script into python parameters - failed with this error: %s " % (str(e),))
		response={'browserAlert':'error extracting form values','dryerror':1}
		print(json.JSONEncoder().encode(response))
		sys.exit()

	################ >ACTION(S) ################
	# FIND CURRENT FLAG
	if (re.search('^[0-9]', pesstoObjectsId)):
		sqlQuery = """SELECT marshallWorkflowLocation
								 FROM pesstoObjects
								 WHERE pesstoObjectsId = %s""" % (pesstoObjectsId,)
		try:
			log.debug("attempting to find the current MWL for pesstoObjectsId %s" % (pesstoObjectsId,))
			rows = m.execute_mysql_read_query(sqlQuery,dbConn, log)
		except Exception, e:
			log.error("could not find the current MWL for pesstoObjectsId %s - failed with this error: %s " % (pesstoObjectsId,str(e),))
			return -1

		for row in rows:
			currentFlag = row['marshallWorkflowLocation']

		# EXECUTE CHANGE OF FLAG
		sqlQuery = """UPDATE pesstoObjects
								SET marshallWorkflowLocation = "%s"
								WHERE pesstoObjectsId = %s""" % (mwfFlag, pesstoObjectsId,)

		try:
		 log.debug("attempting to update the marshall workflow location for pesstoObjectsId %s" % (pesstoObjectsId,))
		 m.execute_mysql_write_query(sqlQuery,dbConn, log)
		except Exception, e:
		 log.error("could not update the marshall workflow location for pesstoObjectsId %s - failed with this error: %s " % (pesstoObjectsId,str(e),))
		 return -1

		sqlQuery = """UPDATE pesstoObjects
									SET dateLastModified = NOW()
									WHERE pesstoObjectsId = %s""" % (pesstoObjectsId,)
		try:
			log.debug("attempting to update the dateLastModified column for pesstoObjectsId %s" % (pesstoObjectsId,))
			m.execute_mysql_write_query(sqlQuery,dbConn, log)
		except Exception, e:
			log.error("could not update the dateLastModified column for pesstoObjectsId - failed with this error: %s " % (str(e),))
			return -1

		# UPDATE CHANGELOG TABLE
		sqlQuery = """INSERT INTO pesstoObjectsChangeLog (
																											pesstoObjectsId,
																											whatWasChanged,
																											whenChangeOccured,
																											changeAuthor
																											)
									VALUES (%s,"moved from %s to %s",NOW(),'web user')""" % (pesstoObjectsId,currentFlag,mwfFlag,)
		try:
			log.debug("attempting to update the changelog table")
			m.execute_mysql_write_query(sqlQuery,dbConn, log)
		except Exception, e:
			log.error("could not update the changelog table - failed with this error: %s " % (str(e),))
			return -1

	return

## LAST MODIFIED : January 8, 2013
## CREATED : January 8, 2013
## AUTHOR : DRYX
def change_awf_flag(dbConn, log, paras):
	"""Change the Alert Workflow Location of an object in the pessto marshall

	**Key Arguments:**
		- ``dbConn`` -- mysql database connection
		- ``log`` -- logger
		- ``params`` -- FieldStorage parameters passed via the URL

	**Return:**
		- None
	"""
	################ > IMPORTS ################
	## STANDARD LIB ##
	import sys
	import os
	import re
	## THIRD PARTY ##
	import json
	## LOCAL APPLICATION ##
	import pesstoMarshallHTMLFramework as phf
	import pesstoMarshallMySQL as pm
	import dryxMySQL as m

	################ > VARIABLE SETTINGS ######
	n = lambda x: paras[x].value
	try:
		log.debug("attempting to parse the URL values passed to the change_awf_flag script into python parameters")
		pesstoObjectsId = n('pesstoObjectsId')
		awfFlag = n('awfFlag')
	except Exception, e:
		log.critical("could not parse the URL values passed to the change_awf_flag script into python parameters - failed with this error: %s " % (str(e),))
		response={'browserAlert':'error extracting form values','dryerror':1}
		print(json.JSONEncoder().encode(response))
		sys.exit()

	################ >ACTION(S) ################
	# FIND CURRENT FLAG
	if (re.search('^[0-9]', pesstoObjectsId)):
		sqlQuery = """SELECT alertWorkflowLocation
									FROM pesstoObjects
									WHERE pesstoObjectsId = %s""" % (pesstoObjectsId,)
		try:
			log.debug("attempting to find the alert workflow location flag for pesstoObjectsId %s" % (pesstoObjectsId,))
			rows = m.execute_mysql_read_query(sqlQuery,dbConn, log)
			for row in rows:
				currentFlag = row['alertWorkflowLocation']
		except Exception, e:
			log.error("could not find the alert workflow location flag for pesstoObjectsId %s - failed with this error: %s " % (pesstoObjectsId,str(e),))
			return -1


	# EXECUTE CHANGE OF FLAG
	sqlQuery = """UPDATE pesstoObjects
								SET alertWorkflowLocation = "%s"
								WHERE pesstoObjectsId = %s""" % (awfFlag, pesstoObjectsId,)
	# UPDATE DATE LAST MODIFIED
	sqlQuery2 = """UPDATE pesstoObjects
								SET dateLastModified = NOW()
								WHERE pesstoObjectsId = %s""" % (pesstoObjectsId,)
	# UPDATE CHANGELOG TABLE
	sqlQuery3 = """INSERT INTO pesstoObjectsChangeLog (
																										pesstoObjectsId,
																										whatWasChanged,
																										whenChangeOccured,
																										changeAuthor
																										)
								VALUES (%s,'alert flag changed from %s to %s',NOW(),'web user')""" % (pesstoObjectsId,currentFlag,awfFlag)

	try:
		log.debug("attempting to update the AWL flag for pesstoObjectsId %s" % (pesstoObjectsId,))
		m.execute_mysql_write_query(sqlQuery,dbConn, log)
		m.execute_mysql_write_query(sqlQuery2, dbConn, log)
		m.execute_mysql_write_query(sqlQuery3, dbConn, log)
	except Exception, e:
		log.error("could not update the AWL flag for pesstoObjectsId %s failed with this error: %s " % (pesstoObjectsId,str(e),))
		return -1

	return


############################################
# PRIVATE (HELPER) FUNCTIONS               #
############################################





## MAIN HOOK ##
if __name__=="__main__":
		main()
