<?php

namespace piSwitchServer\lib\data;


class mysql
{
    protected static $instance;
    public static function instance() {
        if(!isset(self::$instance)) {
            self::$instance = new static();
        }

        return self::$instance;
    }

    protected function __clone() { }

    protected function __wakeup() { }

    protected function __construct() {

    }

}