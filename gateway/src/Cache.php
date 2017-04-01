<?php
namespace Syke\Gateway;

interface Cache
{
    public function store($key, $value, $lifetimeInSecond);
    public function find($key);
}
