<?php


namespace piSwitchHub\lib\config;


class configManager {

    private static $config;
    private static $env;

    public static function get(string $key) {
        if(isset(self::$config[$key])) {
            return self::$config[$key];
        } elseif(self::$env != 'prod') {
            throw new \Exception("Cannot get config value for the key ['{$key}.']");
        }

        return null;
    }

    public static function getEnv() {
        if(!isset(self::$env)) {
            self::$env = getenv('piswitch_env') ?? 'prod';
        }

        return self::$env;
    }

    public static function loadConfig(): array {
        self::$config = [];

        self::$config['db'] = json_decode(getenv('piswitch_mysql'), true);

        switch (self::getEnv()) {
            case 'dev':
                self::loadDevConfig();
                break;
            case 'stage':
                self::loadStageConfig();
                break;
            case 'prod':
            default:
                self::loadProdConfig();
                break;
        }

        return self::$config;
    }

    private static function loadDevConfig() {
        self::$config['displayErrorDetails'] = true;
    }

    private static function loadStageConfig() {

    }

    private static function loadProdConfig() {

    }
}