<?php
/*
Plugin Name: Get Partner Location Information
Plugin URI: http://cmnhospitals.org
Description: ajax endpoint plugin fof retrieving partner location information
Author: Joel Nelson
Version: 0.0
*/

add_action('wp_ajax_get_location_info', 'get_location_info_callback');
add_action('wp_ajax_nopriv_get_location_info', 'get_location_info_callback');

function get_location_info_callback() {
	$partner = $_POST['partner'];
	$location = $_POST['location'];

        $url = "https://webservices.childrensmiraclenetworkhospitals.org/api/Location/" . $partner . "/" . $location;
        $json = file_get_contents($url);
	echo $json;
	wp_die();
}
?>