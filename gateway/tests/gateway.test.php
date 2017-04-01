<?php
declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use PHPUnit\Framework\TestCase;
use \Curl\Curl;
use Syke\Gateway\Gateway;
use Syke\Gateway\Cache;

final class GatewayTest extends TestCase
{
    const URL_TO_FETCH = 'http://www.example.org';
    const PLAIN_TEXT_CURL_RESPONSE = 'response';
    const OBJECT_CURL_RESPONSE = [ 'property' => 'myvalue' ];
    const OBJECT_RESPONSE_IN_JSON = '{"property" : "myvalue"}';
    const JSON_BODY = 'response';
    private $curlMock;
    private $cacheMock;
    private $gateway;
    const CONTENT_TYPE_KEY = 'Content-Type';
    const JSON_MIME_TYPE = 'application/json';
    const XML_MIME_TYPE = 'text/xml';
    const PLAINTEXT_MIME_TYLE = 'text/plain';
    const KNOWN_MIME_TYPE = self::JSON_MIME_TYPE;
    const OTHER_CONTENT_TYPE_PARAMETERS = ';charset=utf-8';
    const EMPTY_GET_PARAMETER_LIST = [];

    /**
     * @before
     */
    public function createMocks() {
        $this->curlMock = $this->createMock(Curl::class);
        $this->cacheMock = $this->createMock(Cache::class);
    }

    public function testGetResponseShouldFetchUrlIfCacheIsEmpty()
    {
        $this->curlMock->response = self::PLAIN_TEXT_CURL_RESPONSE;
        $this->curlMock->responseHeaders = [
            self::CONTENT_TYPE_KEY => self::JSON_MIME_TYPE
        ];

        $this->curlMock
            ->expects($this->once())
            ->method('get')
            ->with(SELF::URL_TO_FETCH);

        $this->gateway = new Gateway($this->curlMock, $this->cacheMock, self::URL_TO_FETCH, self::EMPTY_GET_PARAMETER_LIST);
        $this->gateway->getResponse();
    }

    public function testGetResponseShouldNotFetchUrlIfCacheHit() 
    {

    }

    public function testGetResponseShouldReturnTheResponseBodyWhenServerResponseIsPlainText()
    {
        $this->curlMock->response = self::PLAIN_TEXT_CURL_RESPONSE;
        $this->curlMock->responseHeaders = [
            self::CONTENT_TYPE_KEY => self::PLAINTEXT_MIME_TYLE
        ];
        $this->gateway = new Gateway($this->curlMock, $this->cacheMock, self::URL_TO_FETCH, self::EMPTY_GET_PARAMETER_LIST);

        $actual = $this->gateway->getResponse();

        $this->assertEquals(
            self::PLAIN_TEXT_CURL_RESPONSE,
            $actual
        );
    }

    public function testGetResponseShouldReturnJsonWhenServerResponseIsXml()
    {
        $this->curlMock->response = self::OBJECT_CURL_RESPONSE;
        $this->curlMock->responseHeaders = [
            self::CONTENT_TYPE_KEY => self::XML_MIME_TYPE
        ];
        $this->gateway = new Gateway($this->curlMock, $this->cacheMock, self::URL_TO_FETCH, self::EMPTY_GET_PARAMETER_LIST);

        $actual = $this->gateway->getResponse();

        $this->assertJsonStringEqualsJsonString(
            self::OBJECT_RESPONSE_IN_JSON,
            $actual
        );
    }

    public function testGetResponseShouldReturnJsonWhenServerResponseIsJson()
    {
        $this->curlMock->response = self::OBJECT_CURL_RESPONSE;
        $this->curlMock->responseHeaders = [
            self::CONTENT_TYPE_KEY => self::JSON_MIME_TYPE
        ];
        $this->gateway = new Gateway($this->curlMock, $this->cacheMock, self::URL_TO_FETCH, self::EMPTY_GET_PARAMETER_LIST);

        $actual = $this->gateway->getResponse();

        $this->assertJsonStringEqualsJsonString(
            self::OBJECT_RESPONSE_IN_JSON,
            $actual
        );
    }

    public function testGetResponseShouldTryToGetContentFromCache()
    {
        $this->cacheMock
            ->method('find')
            ->willReturn(self::JSON_BODY);
        $this->cacheMock
            ->expects($this->once())
            ->method('find')
            ->with(self::URL_TO_FETCH);
        $this->gateway = new Gateway($this->curlMock, $this->cacheMock, self::URL_TO_FETCH, self::EMPTY_GET_PARAMETER_LIST);

        $this->gateway->getResponse();
    }

    public function testGetResponseShouldAcceptComplexContentTypes()
    {
        $this->curlMock->response = self::OBJECT_CURL_RESPONSE;
        $this->curlMock->responseHeaders = [
            self::CONTENT_TYPE_KEY => self::KNOWN_MIME_TYPE . self::OTHER_CONTENT_TYPE_PARAMETERS
        ];
        $this->gateway = new Gateway($this->curlMock, $this->cacheMock, self::URL_TO_FETCH, self::EMPTY_GET_PARAMETER_LIST);

        $actual = $this->gateway->getResponse();

        $this->assertJsonStringEqualsJsonString(
            self::OBJECT_RESPONSE_IN_JSON,
            $actual
        );
    }

    public function testGetResponseShouldUseGetParameters()
    {

    }

    public function testGetResponseShouldParseGetParametersSentInUrl()
    {

    }

    public function testGetResponseShouldPassExpirationToCache()
    {

    }
}
