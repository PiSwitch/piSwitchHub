<?php


namespace piSwitchServer\lib\controllers;


class baseController {

    protected $app;

    public function __construct($app) {
        $this->app = $app;
    }

}