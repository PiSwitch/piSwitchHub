<?php
namespace piSwitchHub\lib;

use piSwitchHub\lib\config\configManager;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


class bootstrap {

    private $app;
    private $router;

    function __construct() {
        $config = configManager::loadConfig();
        $this->app = new \Slim\App(['settings' => $config]);
        $this->initDatabase();
        $this->initRoutes();
    }

    public function run() {
        return $this->app->run();
    }

    protected function initDatabase() {
        $container = $this->app->getContainer();
        $container['db'] = function ($container) {
            $dbSettings = $container['settings']['db'];
            $pdo = new \PDO("mysql:host=" . $dbSettings['host'] . ";dbname=" . $dbSettings['dbname'], $dbSettings['user'], $dbSettings['pass']);
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            return $pdo;
        };
    }

    protected function initRoutes() {
        $this->router = new router($this->app);
    }
}