<?php
namespace Syke\Gateway;

class Gateway {
    private $curl;
    private $url;
    private $cache;
    private $lifetimeInSecond;

    const MIME_TYPES_PARSED_AS_OBJECT_BY_CURL = ['text/xml', 'application/json'];

    const MIME_TYPES_NOT_PARSED_BY_CURL = ['text/plain'];

    function __construct($curl, $cache, $url, $lifetimeInSecond = 0) {
        $this->curl = $curl;
        $this->url = $url;
        $this->cache = $cache;
        $this->lifetimeInSecond = $lifetimeInSecond;
    }

    function getUrlContents() {
        $this->curl->get($this->url);

        if ($this->curl->error) {
            throw new \Exception('Error fetching URL. Error code: ' + $this->curl->errorCode + 'Error message: ' + $this->curl->errorMessage + ' URL: ' + $this->url + ')');
        } else {
            $response = (object)[
                'body' => $this->curl->response,
                'contentType' => $this->curl->responseHeaders['Content-Type']
            ];
            return $response;
        }
    }

    private function getResultInJson() {
        $response = $this->getUrlContents();

        if (in_array($response->contentType, self::MIME_TYPES_PARSED_AS_OBJECT_BY_CURL))
            $result = json_encode($response->body);
        elseif (in_array($response->contentType, self::MIME_TYPES_NOT_PARSED_BY_CURL))
            $result = $response->body;
        else {
            throw new \Exception("Cannot parse this response type. (" + $response->contentType + ")");
        }

        return $result;
    }

    public function getResponse() {
        if (!$result = $this->cache->find($this->url)) {
            $result = $this->getResultInJson();
            $this->cache->store($this->url, $result, $this->lifetimeInSecond);
        }

        return $result;
    }
}
