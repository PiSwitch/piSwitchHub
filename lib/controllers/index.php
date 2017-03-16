<?php

namespace piSwitchServer\lib\controllers;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class index extends baseController {

    public function index(Request $request, Response $response) {
        $response->getBody()->write("Hello World!");
    }

    public function testDatabase(Request $request, Response $response) {
        $name = $request->getAttribute('name');
        $response->getBody()->write("<h1>Database test</h1>");

        $result = $this->app->db->query('SELECT * FROM test')->fetchAll();

        foreach ($result as $resultRow) {
            $response->getBody()->write("{$resultRow['id']} => {$resultRow['value']}");
            $response->getBody()->write("<br>");
        }


        return $response;
    }
}