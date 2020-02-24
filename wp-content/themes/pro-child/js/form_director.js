(function($) { 
    
    var currentRequest = null;

    //if (typeof debug !== 'undefined')
         var debug = false;

    if (debug) {
        $(document).ready(function(){
            console.warn("Running from localhost, development mode is ON.");
            $(".hidden").show();
            $("body").append("<div id='dev-banner'>Development Mode On</div>");
        });
    };

    $(document).bind('gform_post_render', function(){

        var elements_a = {
            "validation_form":              {"jQueryObject": $("form.director-validation"), "lookupValue": null},
            "zip_field":                    {"jQueryObject": $(".location-address-wrap .address_zip input"), "lookupValue": null},
            "director_email_field":         {"jQueryObject": $(".director_email_field input"), "lookupValue": "email"},
            "director_first_name_field":    {"jQueryObject": $(".director_name_field .name_first input"), "lookupValue": "firstName"},
            "director_last_name_field":     {"jQueryObject": $(".director_name_field .name_last input"), "lookupValue": "lastName"},
            "director_phone_field":         {"jQueryObject": $(".director_phone_field input"), "lookupValue": "phone"},
            "hospital_name_field":          {"jQueryObject": $(".hospital_name_field input"), "lookupValue": "company"},
            "hospital_address_1_field":     {"jQueryObject": $(".hospital_address_field .address_line_1 input"), "lookupValue": "address1"},
            "hospital_address_2_field":     {"jQueryObject": $(".hospital_address_field .address_line_2 input"), "lookupValue": "address2"},
            "hospital_city_field":          {"jQueryObject": $(".hospital_address_field .address_city input"), "lookupValue": "city"},
            "hospital_state_field":         {"jQueryObject": $(".hospital_address_field .address_state input"), "lookupValue": "province"},
            "hospital_zip_field":           {"jQueryObject": $(".hospital_address_field .address_zip input"), "lookupValue": "postalCode"},
            "hospital_country_field":       {"jQueryObject": $(".hospital_address_field .address_country select"), "lookupValue": "country"},
            "market_field":                 {"jQueryObject": $(".market_field input"), "lookupValue": "marketID"}
        };

        formPopulation(elements_a);

        var elements_b = {
            "select_field":        {"jQueryObject": $(".location-select-wrap select"), "lookupValue": null},
            "address_1_field":     {"jQueryObject": $(".location-address-wrap .address_line_1 input"), "lookupValue": "address1"},
            "address_2_field":     {"jQueryObject": $(".location-address-wrap .address_line_2 input"), "lookupValue": "address2"},
            "city_field":          {"jQueryObject": $(".location-address-wrap .address_city input"), "lookupValue": "city"},
            "state_field":         {"jQueryObject": $(".location-address-wrap .address_state input"), "lookupValue": "state"},
            "zip_field":           {"jQueryObject": $(".location-address-wrap .address_zip input"), "lookupValue": "postalCode"},
            "country_field":       {"jQueryObject": $(".location-address-wrap .address_country select"), "lookupValue": "country"}
        };

        setupMarshaEventHandler(elements_a, elements_b);


    });

    function elementsIteration(elements, callback) {
        for (var key in elements) {
            callback(key, elements[key].jQueryObject, elements[key].lookupValue);
        }
    }

    function elementChecker(key, element, lookup) {
        if(!element.length) {
            console.error("Missing element: " + key);
        }

        else {
            console.log("Element found: " + key);
        }       
    }

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    function postalFilter (postalCode) {

        if (! postalCode) {
            return null;
        }
    
        postalCode = postalCode.toString().trim();
    
        var us = new RegExp("^\\d{5}(-{0,1}\\d{4})?$");
        var ca = new RegExp(/([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i);
    
        if (us.test(postalCode.toString())) {
            return postalCode;
        }
    
        if (ca.test(postalCode.toString().replace(/\W+/g, ''))) {
            postalCode = postalCode.replace(/\W+/g, '').toUpperCase();
            postalCode = postalCode.slice(0, 3) + "%20" + postalCode.slice(3);
            return postalCode;
        }
        return null;
    }
    
    function directorOverrideLookup(code) {

        var directorOverrides = [
            { "original" : "jheadley@childrenscoloradofoundation.org",
             "new" : "kthomas@childrenscoloradofoundation.org" }
        ];        
        return directorOverrides.filter(
            function(data){return data.original == code}
        );
      }

    function formPopulation(elements) {

        // Limit the zip code field to six characters
        elements.zip_field.jQueryObject.attr('maxlength', '7');

        // Check if form is properly setup
        if(elements.validation_form.jQueryObject.length) {
            if(debug) {
                console.group("Form utilizing hospital director lookup detected; Checking existance of required elements.");          
                elementsIteration(elements, elementChecker);
                console.groupEnd();
            }
        }

        else return;

        var $submit_button = $("[id*='gform_submit_button']");

        $(document).ajaxStart(function(){
            $submit_button.prop({"disabled": true, "value": "Loading Data"});
        });

        $(document).ajaxStop(function(){
            $submit_button.prop({"disabled": false, "value": "Submit"});
        });

        elements.validation_form.jQueryObject.each(function(){
            
            elements.zip_field.jQueryObject.on("keyup", function(e) {
                injectData(e, $(this), elements);
            });
        });
    }

    function injectData (e, $jQueryElement, elements) {

        var code = (e.keyCode || e.which);

        if(code == 37 || code == 38 || code == 39 || code == 40) {
            return;
        }                
      
        var postalCode = $jQueryElement.val();
        var countryCode = null;
        
        if (postalCode.length >= 5) {
            postalCode = postalFilter(postalCode);
        }

        else return;

        if (postalCode !== null) {

            if(debug) console.info("Valid postal code entered: " + postalCode);

            if(!$("#locate_hospital_alert").length) {
                $(".location-address-wrap").append("<li><div id='locate_hospital_alert' class='x-alert x-alert-info x-alert-block'></li>");  
            }

            $("#locate_hospital_alert").html("<i class='x-icon x-icon-spinner icon-spin' data-x-icon='' aria-hidden='true'></i> Finding hospital for <strong>" + unescape(postalCode) + "</strong>...");
    
            // Get the director information and populate the correct fields

            var requestId = randomString(8, '0123456789ABCDEF');

            currentRequest = $.ajax({
                url : object_name.templateUrl + "/json_loader.php?uri=Contacts/PrimaryProgramDirector/" + postalCode,
                beforeSend : function() {

                    if(debug) console.log("Initiating API request ID: " + requestId);

                    if(currentRequest !== null) {
                        currentRequest.abort();
                    }
                },

                error:function(jqXHR, textStatus, errorThrown) {
                    if (errorThrown === 'abort') {
                        console.warn("Request Aborted, ID: " + requestId);
                    }
                },

                success: function(data) {

                    if(data.substring(0,5) === 'Error') {
                        $("#locate_hospital_alert").removeClass("x-alert-info").addClass("x-alert-warning").html("<i class='x-icon x-icon-warning' data-x-icon='' aria-hidden='true'></i> There was an error retrieving the hospital information.  You can still submit the form, however!");
                        return;
                    }

                    // Clean up the string being passed from json_loader.php
                    data = data.replace(/\\/g, "");
                    data = data.substring(1, data.length-1);

                    var json = JSON.parse(data);

                    if (debug) console.log("Connection successful!");

                    // Iterate through the input fields and assign the values from the JSON
                    elementsIteration(elements, function(key, element, lookup) {
                        var insertedValue = json[lookup];

                        if (lookup === null) return; // Skip the fields with null lookup values
                        else if(lookup === 'email') {
                            var directorEntry = directorOverrideLookup(insertedValue)[0];
                            
                            if (typeof directorEntry != 'undefined')
                                insertedValue = directorEntry.new;
                        }

                        element.val(insertedValue);
                    });

                    $("#locate_hospital_alert").addClass("x-alert-success").html("<i class='x-icon x-icon-hospital-o' data-x-icon='' aria-hidden='true'></i> Your hospital is: " + json.hospital);

                    $.get(object_name.templateUrl + "/json_loader.php?uri=Hospitals?key=PostalCode%26value=" + postalCode, function(data){
                        // data = data.replace(/\\/g, "");
                        // data = data.substring(2, data.length-2);

                        var json = JSON.parse(data);

                        $(".market_field input").val(json.market);
                    });
                },

                complete: function() {
                    if(debug) console.log("Request " + requestId + " complete, clearing ajax object.");
                    currentRequest = null;
                }
            });
        }

        // Clears the fields when there is an invalid postal code existing in the postal field
        else {

            elementsIteration(elements, function(key, element, lookup) {
                if (lookup === null) return; // Skip the fields with null lookup values because those were the only ones filled
                element.val('');
            });

            $("#locate_hospital_alert").remove();
            $("#postal-error").text("");
            $("#input_1_28").val('');
        }       
    }

    // MARSH Code Population

    function setupMarshaEventHandler(elements_a, elements) {

        var lookup = {};

        elements.select_field.jQueryObject.change(function(){
            var selectedLocation = getLocationByCode($(this).val())[0];

            elementsIteration(elements, function(key, element, lookup) {
                if (lookup === null) return;
                else if (lookup =="country" && selectedLocation[lookup] === 'US') selectedLocation[lookup] = 'United States';
                else if (lookup =="country" && selectedLocation[lookup] === 'CA') selectedLocation[lookup] = 'Canada';
                element.val(selectedLocation[lookup]);
            });
            
        injectData (32, elements.zip_field.jQueryObject, elements_a);
        });
    }

    function elementsIteration(elements, callback) {
        for (var key in elements) {
            callback(key, elements[key].jQueryObject, elements[key].lookupValue);
        }
    }    

    function getLocationByCode(code) {
        return window.locations.filter(
            function(data){return data.locationNumber == code}
        );
    }
})(jQuery);