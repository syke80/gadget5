<?php
namespace Syke\Gateway;

class Gateway {
    private $curl;
    private $url;
    private $getParameters;
    private $cache;
    private $lifetimeInSecond;

    const MIME_TYPES_PARSED_AS_OBJECT_BY_CURL = ['text/xml', 'application/json'];

    const MIME_TYPES_NOT_PARSED_BY_CURL = ['text/plain'];

    function __construct($curl, $cache, $url, $getParameters, $lifetimeInSecond = 0) {
        $this->curl = $curl;
        $this->url = $url;
        $this->getParameters = $getParameters;
        $this->cache = $cache;
        $this->lifetimeInSecond = $lifetimeInSecond;
    }

    public function getResponse() {
        if (!$result = $this->cache->find($this->url)) {
            $result = $this->getResultInJson();
            $this->cache->store($this->url, $result, $this->lifetimeInSecond);
        }

        return $result;
    }

    function getUrlContents() {
        $url = $this->urlWithoutParameters();
        $getParameters = empty($this->getParameters) ? $this->parametersExtractedFromUrl() : $this->getParameters;

        $this->curl->get($url, $getParameters);

        if ($this->curl->error) {
            throw new \Exception('Error fetching URL. Error code: ' . $this->curl->errorCode . 'Error message: ' . $this->curl->errorMessage . ' URL: ' . $this->url . ')');
        } else {
            $contentType = $this->curl->responseHeaders['Content-Type'];
            $mediaType = explode(';', $contentType)[0];
            $response = (object)[
                'body' => $this->curl->response,
                'mediaType' => $mediaType
            ];
            return $response;
        }
    }

    private function urlWithoutParameters() {
        $urlParts = parse_url($this->url);
        $path = isset($urlParts['path']) ? $urlParts['path'] : '';
        $url = $urlParts['scheme'] . '://' . $urlParts['host'] . $path;

        return $url;
    }

    private function parametersExtractedFromUrl() {
        $urlParts = parse_url($this->url);
        $query = isset($urlParts['query']) ? $urlParts['query'] : '';
        $getParameters = [];
        parse_str($query, $getParameters);

        return $getParameters;
    }

    private function getResultInJson() {
        $response = $this->getUrlContents();

        if (in_array($response->mediaType, self::MIME_TYPES_PARSED_AS_OBJECT_BY_CURL))
            $result = json_encode($response->body);
        elseif (in_array($response->mediaType, self::MIME_TYPES_NOT_PARSED_BY_CURL))
            $result = $response->body;
        else {
            throw new \Exception("Cannot parse this response type. (" . $response->mediaType . ")");
        }

        return $result;
    }
}
