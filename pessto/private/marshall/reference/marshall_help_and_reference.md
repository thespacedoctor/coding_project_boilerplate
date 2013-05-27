
PESSTO Marshall Reference Notes
==============================

Everything you need to know about the pessto marshall shall hopefully appear on, or be linked off, this page.  

### Contents ###

1. [Release Notes][rn]  
2. [Questions, Requests and Bugs][qrb]
3. [Marshall Screencast Manual][msm]
4. [Useful Add-ons][ua]


## Release Notes[rn] ##

Release notes for the marshall can be found [here](marshall_release_notes.html).

## Questions, Requests and Bugs[qrb] ##

To ***request a new feature for the marshall***, or to ***report a bug*** please add it to [this designated wiki page](https://sites.google.com/a/pessto.org/wiki/pessto-operation-groups/pessto-targets-alerts/marshall-feature-request-and-bug-list).   

Any ***questions*** you have that are not answered below, or within the tutorial screencasts, please email [marshall@pessto.org](mailto:marshall@pessto.org) - answers will then be posted on [the marshall forum](https://groups.google.com/a/pessto.org/forum/#!forum/marshall).  

# Marshall Screencast Manual[msm] #

#### Table of Content ####

1. [The Marshall workflow][tmw]
2. [An overview of the user interface][aootui]
3. [The search bar][search]
4. [The sort bar][sort]
5. [Building Custom URLs][bcu]

* Marshall workflow diagrams ( [overview](../notes_images/2012.06.18_marshall_ui_workflow.png) | [detailed](../notes_images/2012.06.18_marshall_software_workflow.png) | [keynote talk from June 2012](2012.06.20_pessto_marshall_overview_oxford.key) )

## 1. The Marshall Workflow[tmw] ##

Here's a simple schematic of the marshall workflow - note that not all aspects of the workflow are fully automated yet. For a more detailed overview of the marshall you can see check out this [more involved schematic][detaileds]. You can also download [Dave's keynote][okn] from the Oxford June 2012 meeting.

!["simple schematic of the marshall workflow"][simples]


[simples]: ../notes_images/2012.06.18_marshall_ui_workflow.png width="500px" 
[detaileds]: ../notes_images/2012.06.18_marshall_software_workflow.png
[okn]: ../notes_images/2012.06.20_pessto_marshall_overview_oxford.key

### **SC001**: A walkthrough of the marshall workflow ###
**posted September 7, 2012** - Marshall v0.5

<span class="center"> <iframe width="640" height="480" src="http://www.youtube.com/embed/pnNO6bPpbRM" frameborder="0" allowfullscreen></iframe></span>

[watch this video on youtube](http://www.youtube.com/embed/pnNO6bPpbRM)


## 2. An overview of the user interface[tmw] ##

### **SC002**: the marshall user interface[aootui] ###
**posted September 7, 2012** - Marshall v0.5

<span class="center"> <iframe width="640" height="480" src="http://www.youtube.com/embed/IS3R0gG_dBs" frameborder="0" allowfullscreen></iframe></span>

[watch this video on youtube](http://youtu.be/IS3R0gG_dBs)

## 3. The search bar[search] ##

![The search bar][sbi]

[sbi]: ../notes_images/2012.11.21t13.56s11_mac_screengrab.png

To search for an object or a group of objects type in partial or full object names into the search bar.

### **SC003**: the search-bar ###
**posted November 22, 2012** - Marshall v0.61

<span class="center"> <iframe width="640" height="480" src="http://www.youtube.com/embed/xGQp9MflcfQ" frameborder="0" allowfullscreen></iframe></span>

[watch this video on youtube](http://www.youtube.com/watch?v=xGQp9MflcfQ)

## 4. The sort bar[sort] ##

![The sort bar][stbi]

[stbi]: ../notes_images/2012.11.21t13.59s36_mac_screengrab.png

Within any page you can sort by almost whatever you want! The marshall will try and guess what you mean, so for example if you want to sort by redshift type *redshift* or *z* into the sort bar. The bar will turn from red to green whenever the marshall understands. Here's an incomplete list of the keyword the sort-bar should recognise:

*peak abs mag, peak absolute magnitude, abs mag, absolute magnitude, z, distance, mpc, redshift, magnitude, mag, apparent magnitude, app mag, classification, class, spectral type, type,prediction, dec, ra, id, name, object id, identity*

### **SC004**: the sort-bar ###
**posted November 22, 2012** - Marshall v0.61

<span class="center"> <iframe width="640" height="480" src="http://www.youtube.com/embed/EmX0QUluz6g" frameborder="0" allowfullscreen></iframe></span>

[watch this video on youtube](http://www.youtube.com/watch?v=EmX0QUluz6g)

## 5. Building a Custom URL[bcu] ##

Many of the big online search engines use a special syntax that allow a user to build their own search URL. The power of this syntax is in the flexibility it gives the user to build any type of search query they desire - from a very board to an extremely specific search.

!["google url with search tokens"][img1]

I have been building this same syntax into the pessto marshall urls with what I am call *search and sort tokens*. The standard marshall URL is:
	
	`http://www.pessto.org/pessto/private/marshall/scripts/index.cgi`

This is followed by a `?` to indicate that we are are about include some search and sort tokens. Each token includes a key and a value and is written as `key=value`. Finally each token is separated by an `&`.
  
!["url syntax"][img2]

[img1]: ../notes_images/2012.09.28t11.43s20_mac_screengrab.png
[img2]: ../notes_images/2012.09.28t12.23s42_mac_screengrab.png width="800px" 

Up-to-date list of the search and sort tokens
-------------------------------------------------------------------

| **key** 	| **definition** 	| **accepted value(s) **	| 
| -----	| ------------	| -------------------	| -
| **bi** 	| body index 	| a predefined list of objects e.g. inbox, allClassified. Note you can set the value to 'all' to show all of the objects in the marshall. 	|
| **pageMax** 	| maximum number of object tickets to be displayed on a page 	| any integer 	|
| **pageIndex** 	| given a list of objects this number indicates where in the list to start the displaying the object tickets. For example if pageIndex=23 the marshall shall displaying the specified list of objects from object number 23 in that list. 	| any integer 	|
| **search** 	| search the marshall of each occurrence of this string - currently only names and akas are searched. Partial and regexs are accepted 	| currently any string 	|
| **sort** 	| the parameter via which to sort the give marshall object list - intelligent enough to accept a variety of ways defining the same parameter, e.g. abs mag, absolute magnitude, peak abs mag …	| - absolute magnitude, obsdate, magnitude, identity, prediction, distance, redshift, ra, dec, classification 	|

### **SC005**: building custom urls ###
**posted November 22, 2012** - Marshall v0.61

<span class="center"> <iframe width="640" height="480" src="http://www.youtube.com/embed/xXT47gUF_K0" frameborder="0" allowfullscreen></iframe></span>

[watch this video on youtube](http://www.youtube.com/watch?v=xXT47gUF_K0)


## Useful Add-ons[ua] ##

#### Marshall Search - mac service tool ####

[Download Marshall Search mac service tool.](search%20pessto%20marshall.workflow.zip)

**Installation video** - the sound screwed up in the video, but I've added captions.
<span class="center"> <iframe width="640" height="480" src="http://www.youtube.com/embed/PPclUVp9h3k" frameborder="0" allowfullscreen></iframe></span>

[watch this video on youtube](http://www.youtube.com/watch?v=PPclUVp9h3k)
