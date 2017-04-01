<?php
namespace Syke\Gateway;

class SqlCache implements Cache
{
    private $connection;

    function __construct($connection)
    {
        $this->connection = $connection;
    }

    public function store($key, $value, $lifetimeInSecond)
    {
        $statement = $this->connection->prepare("REPLACE INTO cache(`key`, `value`, `expire`) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))");

        if (!$statement) {
            echo "Prepare failed: (" . $this->connection->errno . ") " . $this->connection->error;
        }

        if (!$statement->bind_param('sss', $key, $value, $lifetimeInSecond)) {
            echo "Binding parameters failed: (" . $this->connection->errno . ") " . $this->connection->error;
        }

        if (!$statement->execute()) {
            echo "Execute failed: (" . $this->connection->errno . ") " . $this->connection->error;
        }

        $statement->close();
    }

    public function find($key)
    {
        $statement = $this->connection->prepare("SELECT `value` FROM cache WHERE `key` = ? AND `expire` > NOW()");

        if (!$statement) {
            echo "Prepare failed: (" . $this->connection->errno . ") " . $this->connection->error;
        }

        if (!$statement->bind_param('s', $key)) {
            echo "Binding parameters failed: (" . $this->connection->errno . ") " . $this->connection->error;
        }

        if (!$statement->execute()) {
            echo "Execute failed: (" . $this->connection->errno . ") " . $this->connection->error;
        }

        $value = "";
        if (!$statement->bind_result($value)) {
            echo "Binding output parameters failed: (" . $statement->errno . ") " . $statement->error;
        }

        $statement->fetch();
        $statement->close();

        return $value;
    }
}
