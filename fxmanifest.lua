fx_version "cerulean"
game "gta5"

lua54 "yes"

description "fishing"

dependency "vrp"

ui_page "nui/index.html"

file "nui/**"

shared_scripts {
    "config/config_rods.lua"
}

client_scripts {
    "@vrp/client/Tunnel.lua",
    "@vrp/client/Proxy.lua",
    "config/config.lua",
    "lang.lua",
    "client/*.lua"
}

server_scripts {
    "@vrp/lib/utils.lua",
    "server/server.lua"
}
