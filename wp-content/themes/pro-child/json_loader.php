<?php
  
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);

	$api = new ApiRequestor([
		'attempts' => 5,
		'interval' => 1,
		'clientId' => 'B4AEDA06-7898-49CF-9C9C-531167E05482',
		'baseUrl' => 'https://api.cmnhospitals.org/v1/'
		]);

	echo $api -> get_data();

	class ApiRequestor {
      
        private $uri = null;
		private $settings = [];
	  
		function __construct($x_settings) {

			// Load passed in settings
			foreach($x_settings as $key=>$value) {
				$this->settings[$key] = $x_settings[$key];
            }
		}
	  
		public function get_data() {

            if(isset($_GET['uri'])) {
                $this->uri = $_GET['uri'];
            }
            else {
                exit("URI not set - set with '?uri=';  See API's Swagger: https://api.cmnhospitals.org/swagger/index.html");
            }

            $url = $this->settings['baseUrl'].$_GET["uri"];
			$url = str_replace ( ' ', '%20', $url);

            $this->check_headers($url);
			$json = json_encode($this->get_curl($url, $this->settings['clientId']), JSON_PRETTY_PRINT);
		  
			return $json;
		}

		private function get_curl($url, $clientId) {
			$curl = curl_init();
			curl_setopt($curl, CURLOPT_URL, $url);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($curl, CURLOPT_HTTPHEADER, array('X-ClientId: '.$clientId));
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
			$output = curl_exec($curl);  	
			curl_close($curl);
			return $output;
		}

		// Checks to see if the api resource is available
		private function check_headers($url) {
			$tries = 0;
			while ($this->get_http_response_code($url) != "200") {
				$tries++;
				if ($tries == $this->settings['attempts'])
					exit("Error: A connection could not be established -- Code: ".$this->get_http_response_code($url));
				sleep($this->settings['interval']);
			}
		}

	  private function get_http_response_code($url) {
			$headers = get_headers($url);
			return substr($headers[0], 9, 3);
	  }
	}
?>