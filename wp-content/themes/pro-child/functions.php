<?php

// =============================================================================
// FUNCTIONS.PHP
// -----------------------------------------------------------------------------
// Overwrite or add your own custom functions to Pro in this file.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Enqueue Parent Stylesheet
//   02. Additional Functions
// =============================================================================

// Enqueue Parent Stylesheet
// =============================================================================

add_filter( 'x_enqueue_parent_stylesheet', '__return_true' );

function test_info() {
	echo phpinfo();
}
add_shortcode('test_info', 'test_info');

// Additional Functions
// =============================================================================

add_filter( 'gform_pre_render', 'populate_locations' );
// add_filter( 'gform_pre_validation', 'populate_locations' );
// add_filter( 'gform_pre_submission_filter', 'populate_locations' );
//add_filter( 'gform_admin_pre_render', 'populate_locations' );

add_action('wp_enqueue_scripts', 'pro_child_enqueue_scripts');

function pro_child_enqueue_scripts() {
    wp_register_script('form_director', get_stylesheet_directory_uri().'/js/form_director.js');
    wp_enqueue_script('jquery');
    wp_enqueue_script('form_director');
    $translation_array = array( 'templateUrl' => get_stylesheet_directory_uri() );
    wp_localize_script( 'form_director', 'object_name', $translation_array );
}

$host = $_SERVER['HTTP_HOST'];
if (strpos("x".$host, 'localhost')) {
    if(! is_admin())
        echo "<script>var debug = true;</script>";
    ini_set('display_errors', 'On');
}

function populate_locations( $form, $choice_markup = "" ) {
	// try {
    foreach ( $form['fields'] as &$field ) {

        if ( $field->type != 'select' || strpos( $field->cssClass, 'location-select-wrap' ) === false ) {
            continue;
        }

        $locations = null;       
        $url = "https://api.cmnhospitals.org/v1/Locations/PartnerId/71";
		
		while(!$locations) {
        	$json = file_get_contents($url);
        	$locations = json_decode($json, true);
		}

        $canada_url = "https://api.cmnhospitals.org/v1/Locations/PartnerId/72";		
		$canada_locations = null;
		
		while(!$canada_locations) {
        	$canada_json = file_get_contents($canada_url);
        	$canada_locations = json_decode($canada_json, true);
		}

        $choices = array();

        $all_locations = array_merge($locations, $canada_locations);

        echo "<script> window.locations = " . json_encode($all_locations) . "; </script>";

        foreach ($locations as $locations[$i]) {
            $choices[] = array( 'text' => $locations[$i]["locationNumber"] . ' - ' . $locations[$i]["locationName"], 'value' => $locations[$i]["locationNumber"] );    
        }

        foreach ($canada_locations as $canada_locations[$i]) {
            $choices[] = array( 'text' => $canada_locations[$i]["locationNumber"] . ' - ' . $canada_locations[$i]["locationName"], 'value' => $canada_locations[$i]["locationNumber"] );    
        }

        asort($choices);

        $field->choices = $choices;
    }

    return $form;
	// }
	// catch (Exception $e) {
	// 	echo "<script>console.log( 'Error filling location list. " . $e.->getMessage() . "' );</script>";
	// }
}
