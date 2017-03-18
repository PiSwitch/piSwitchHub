<?php


namespace piSwitchHub\lib;


use piSwitchHub\lib\controllers\index;
use Slim\App;

class router {

    private $app;

    function __construct(App $app) {
        $this->app = $app;
        $this->setRoutes();
    }

    protected function registerControllers() {
        $container = $this->app->getContainer();
        $container[index::class] = function ($c) {
            return new index($c);
        };
    }

    protected function setRoutes() {

        $this->app->group('/', function () {
            $this->get('', index::class . ':index');
            $this->get('test_database', index::class . ':testDatabase');
        });
    }
}