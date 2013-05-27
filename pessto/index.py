#!/usr/local/bin/python
# encoding: utf-8
"""
index
===============
:Summary:
    Landing script for public PESSTO.org pages

:Author:
    David Young

:Date Created:
    January 29, 2013

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
    """Page building definition for PESSTO.org index script

    Key Arguments:
        -
        - dbConn -- mysql database connection
        - log -- logger

    Return:
        - None
    """
    ################ > IMPORTS ################
    relativePathToProjectRoot = "../../../"
    sys.path.append("../../../pm_common_code/python/")
    import pesstoMarshallPythonPath as pp
    pp.set_python_path(relativePathToProjectRoot)

    ## STANDARD LIB ##
    import cgi
    import cgitb
    ## THIRD PARTY ##

    ## LOCAL APPLICATION ##
    import pesstoMarshallCommonUtils as p
    import dryxCommonUtils as cu
    import pesstoMarshallHTMLFramework as phf

    ################ > SETUP ##################
    ## ENABLE DEBUGGING
    # cgitb.enable()
    ## SETUP DB CONNECTION AND A LOGGER
    dbConn, log = p.settings(relativePathToProjectRoot)
    ## START LOGGING ##
    startTime = cu.get_now_sql_datetime()
    log.info('--- STARTING TO RUN THE index AT %s' % (startTime,))
    # GRAB FIELD STORAGE ARGUMENTS
    fs = cgi.FieldStorage()

    # IF NO PARAMETERS PASSED THEN JUST DISPLAY THE INBOX
    if(len(fs) == 0):
        bodyId = 'index'
    else:
        bodyId = fs['bi'].value

    ################ > VARIABLE SETTINGS ######
    ## SETUP THE VARIOUS URL TOKEN VALUES
    if("item" in fs):
        item = fs['item'].value

    ################ >ACTION(S) ###############
    text = "Content-Type: text/html\n\n"
    text += phf.build_public_pessto_page(dbConn, log, bodyId)

    dbConn.commit()
    dbConn.close()
    ## FINISH LOGGING ##
    endTime = cu.get_now_sql_datetime()
    runningTime = cu.calculate_time_difference(startTime, endTime)
    log.info('-- FINISHED ATTEMPT TO RUN THE index AT %s (RUNTIME: %s) --' % (endTime, runningTime, ))

    print text
    return

###################################################################
# CLASSES                                                         #
###################################################################

###################################################################
# PUBLIC FUNCTIONS                                                #
###################################################################

###################################################################
# PRIVATE (HELPER) FUNCTIONS                                      #
###################################################################

if __name__ == '__main__':
    main()


###################################################################
# TEMPLATE FUNCTIONS                                              #
###################################################################
