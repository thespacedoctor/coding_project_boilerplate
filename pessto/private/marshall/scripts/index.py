#!/usr/bin/python
# -*- coding: utf-8 -*-
################# GLOBAL IMPORTS ####################
""" index
This is the index page for the PESSTO Marshall workflow pages (pages with object tickets)

Created by David Young on July 2012
If you have any questions requiring this script please email me: d.r.young@qub.ac.uk

dryx syntax:
xxx = come back here and do some more work
_someObject = a 'private' object that should only be changed for debugging

notes:
    - Dave started work on this file on July 2012 """

import sys
import os


######################################################
# MAIN LOOP - USED FOR CGI SCRIPTING                 #
######################################################

def main():
    """ one-line summary

    **Key Arguments:**
        -
        - ``dbConn`` -- mysql database connection
        - ``log`` -- logger

    **Return:**
        - ``None`` """

    # ######### PRE-IMPORT SETUP ##########
    relativePathToProjectRoot = '../../../../../../'
    sys.path.append(relativePathToProjectRoot + 'dependencies/dryx_code/python/dryxProjectSetup/')
    import dryxProjectSetup as dps
    dps.set_python_path(relativePathToProjectRoot)
    dps.setup_helper_variables(relativePathToProjectRoot)
    # # SETUP DB CONNECTION AND A LOGGER
    (dbConn, log) = dps.settings(dbConn=False, log=True)
    # ######### IMPORTS ##########
    # # STANDARD LIB ##
    # # THIRD PARTY ##
    import cgi
    import MySQLdb as ms
    import cgitb
    import glob
    import numpy
    import datetime
    import yaml
    cgitb.enable()  # ENABLE DEBUGGING
    # # LOCAL APPLICATION ##
    import pesstoMarshallCommonUtils as p
    import pesstoMarshallHTMLFramework as phf
    import pesstoMarshallMySQL as pm
    # ############### > SETUP ##################
    # # SETUP DB CONNECTION AND A LOGGER
    (dbConn, log) = p.settings(relativePathToProjectRoot)
    # # START LOGGING ##
    # log.info('----- STARTING TO RUN THE index CGI SCRIPT -----')
    # ############### > VARIABLE SETTINGS ######
    fs = cgi.FieldStorage()  # GRAB ARGUMENTS
    # DEFAULT VARIABLES
    pageMax = 20
    pageIndex = 0
    orderBy = 'pesstoObjects.pesstoObjectsId DESC'
    sortBy = 'transientBucketId'
    sortDir = None
    search = None
    # ############### >ACTION(S) ###############
    # IF GIVEN ONE PARAMETERS THEN DISPLAY THE INBOX
    if len(fs) == 0:
        bodyId = 'inbox'
    else:
        bodyId = fs['bi'].value
    # bodyId = 'followupReview'    # USE FOR DEBUGGING VARIOUS MARSHALL PAGES
    # # SETUP THE VARIOUS URL TOKEN VALUES
    if fs.has_key('pageMax'):
        pageMax = fs['pageMax'].value
    if fs.has_key('pageIndex'):
        pageIndex = fs['pageIndex'].value
    if fs.has_key('orderBy'):
        orderBy = fs['orderBy'].value
    if fs.has_key('sortBy'):
        sortBy = fs['sortBy'].value
    if fs.has_key('sortDir'):
        sortDir = fs['sortDir'].value
    if fs.has_key('search'):
        search = fs['search'].value
    # INSTANIATE THE MYSQL sqlQuery OBJECT FROM CLASS - FIND ALL pesstoObjectsIds WITH THE SPECFIC FLAG SET DETERMINED BELOW
    sqlQuery = pm.get_pessto_objects_with_flagset(dbConn, log)
    sqlQuery.pageMax = str(pageMax)
    sqlQuery.pageIndex = str(pageIndex)
    sqlQuery.sortBy = sortBy
    sqlQuery.search = search
    if bodyId == 'inbox':
        pageTitle = 'inbox'
        sqlQuery.mwfFlag = '"inbox"'
    elif bodyId == 'followupReview':
        pageTitle = 'followup review'
        sqlQuery.mwfFlag = '"review for followup"'
    elif bodyId == 'alertQueue':
        pageTitle = 'alert queue'
        sqlQuery.mwfFlag = None
        sqlQuery.awfFlag = '"queued for alert"'
        sqlQuery.cfllag = None
    elif bodyId == 'allObsQueue':
        pageTitle = 'obs queue'
        sqlQuery.mwfFlag = '"pending observation" OR p.marshallWorkflowLocation="following"'
    elif bodyId == 'classificationQueue':
        pageTitle = 'classification queue'
        sqlQuery.mwfFlag = '"pending observation"'
    elif bodyId == 'followupQueue':
        pageTitle = 'followup queue'
        sqlQuery.mwfFlag = '"following"'
    elif bodyId == 'allClassified':
        pageTitle = 'all classified'
        sqlQuery.cFlag = 1
    elif bodyId == 'archive':
        pageTitle = 'archive'
        sqlQuery.mwfFlag = '"archive"'
    elif bodyId == 'pendingClassification':
        pageTitle = 'pending classification'
        sqlQuery.mwfFlag = '"pending classification"'
    elif bodyId == 'followupComplete':
        pageTitle = 'followup complete'
        sqlQuery.mwfFlag = '"followup complete"'
    elif bodyId == 'all':
        pageTitle = 'all'
        sqlQuery.magic = '"giveMeEverything"'
    table = phf.get_workflow_table(
        dbConn,
        log,
        sqlQuery,
        bodyId,
        pageMax,
        pageIndex,
        )
    try:
        log.debug('attempting to get the classification forms for the index page')
        classificationFormList = phf.get_classification_form_windows(
            dbConn,
            log,
            sqlQuery,
            )
    except Exception, e:
        log.critical('could not get the classification forms for the index page - failed with this error: %s '
                     % (str(e), ))
        return -1
    webpage = phf.get_table_webpage(
        dbConn,
        log,
        pageTitle,
        bodyId,
        table,
        classificationFormList,
        )
    print webpage
    dbConn.commit()
    dbConn.close()
    # # FINISH LOGGING ##
    # log.info('----- FINISHED ATTEMPT TO RUN THE index CGI SCRIPT -----')
    return


#############################################################################################
# CLASSES                                                                                   #
#############################################################################################
#############################################################################################
# PUBLIC FUNCTIONS                                                                          #
#############################################################################################
#############################################################################################
# PRIVATE (HELPER) FUNCTIONS                                                                #
#############################################################################################
if __name__ == '__main__':
    main()
