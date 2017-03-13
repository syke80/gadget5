<?php
/**
 * List of available gadgets (gadgets/*)
 */
header("Content-Type: application/json");
$gadgetlist = array();
if ($handle = opendir('gadgets')) { 
	while (false !== ($dir = readdir($handle))) {
		if ($dir!='.' && $dir!='..') $gadgetlist[] = $dir; 
	} 
	closedir($handle); 
}
echo json_encode($gadgetlist);