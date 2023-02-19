var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "send": function (id, data) {
    if (id) {
      if (background.port) {
        if (background.port.name !== "webapp") {
          chrome.runtime.sendMessage({
            "method": id,
            "data": data,
            "path": "interface-to-background"
          }, function () {
            return chrome.runtime.lastError;
          });
        }
      }
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "port": background.port.name,
          "path": "interface-to-background"
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (let id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-interface") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "iframe": {
    "window": document.querySelector("iframe").contentWindow
  },
  "addon": {
    "homepage": function () {
      return chrome.runtime.getManifest().homepage_url;
    }
  },
  "resize": {
    "timeout": null,
    "method": function () {
      if (config.port.name === "win") {
        if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
        config.resize.timeout = window.setTimeout(async function () {
          let current = await chrome.windows.getCurrent();
          /*  */
          config.storage.write("interface.size", {
            "top": current.top,
            "left": current.left,
            "width": current.width,
            "height": current.height
          });
        }, 1000);
      }
    }
  },
  "app": {
    "stop": function () {
      config.iframe.window.postMessage({
        "from": "app",
        "name": "stop"
      }, '*');
    },
    "start": function () {
      config.iframe.window.postMessage({
        "from": "app",
        "name": "storage",
        "value": {
          "scale": config.app.prefs.scale,
          "level": config.app.prefs.level,
          "useai": config.app.prefs.useai,
          "usepatch": config.app.prefs.usepatch,
          "patchsize": config.app.prefs.patchsize
        }
      }, '*');
    },
    "prefs": {
      set scale (val) {config.storage.write("scale", val)},
      set level (val) {config.storage.write("level", val)},
      set useai (val) {config.storage.write("useai", val)},
      set usepatch (val) {config.storage.write("usepatch", val)},
      set patchsize (val) {config.storage.write("patchsize", val)},
      get scale () {return config.storage.read("scale") !== undefined ? config.storage.read("scale") : "4x"},
      get useai () {return config.storage.read("useai") !== undefined ? config.storage.read("useai") : false},
      get level () {return config.storage.read("level") !== undefined ? config.storage.read("level") : "thick"},
      get usepatch () {return config.storage.read("usepatch") !== undefined ? config.storage.read("usepatch") : true},
      get patchsize () {return config.storage.read("patchsize") !== undefined ? config.storage.read("patchsize") : 16}
    }
  },
  "port": {
    "name": '',
    "connect": function () {
      config.port.name = "webapp";
      let context = document.documentElement.getAttribute("context");
      /*  */
      if (chrome.runtime) {
        if (chrome.runtime.connect) {
          if (context !== config.port.name) {
            if (document.location.search === "?win") {
              config.port.name = "win";
            }
          }
        }
      }
      /*  */
      document.documentElement.setAttribute("context", config.port.name);
    }
  },
  "load": function () {
    const reload = document.getElementById("reload");
    const support = document.getElementById("support");
    const donation = document.getElementById("donation");
    /*  */
    reload.addEventListener("click", function () {
      document.location.reload();
    });
    /*  */
    support.addEventListener("click", function () {
      const url = config.addon.homepage();
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    donation.addEventListener("click", function () {
      const url = config.addon.homepage() + "?reason=support";
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    config.storage.load(config.app.start);
    window.removeEventListener("load", config.load, false);
  },
  "storage": {
    "local": {},
    "read": function (id) {
      return config.storage.local[id];
    },
    "load": function (callback) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    },
    "write": function (id, data) {
      if (id) {
        if (data !== '' && data !== null && data !== undefined) {
          let tmp = {};
          tmp[id] = data;
          config.storage.local[id] = data;
          chrome.storage.local.set(tmp);
        } else {
          delete config.storage.local[id];
          chrome.storage.local.remove(id);
        }
      }
    }
  },
  "message": function (e) {
    if (e) {
      if (e.data) {
        if (e.data.from === "sandbox") {
          if (e.data.name === "scale") {
            config.app.prefs.scale = e.data.value.scale;
          }
          /*  */
          if (e.data.name === "level") {
            config.app.prefs.level = e.data.value.level;
          }
          /*  */
          if (e.data.name === "patchsize") {
            config.app.prefs.patchsize = e.data.value.patchsize;
          }
          /*  */
          if (e.data.name === "usepatch") {
            config.app.prefs.usepatch = e.data.value.usepatch;
          }
          /*  */
          if (e.data.name === "useai") {
            config.app.prefs.useai = e.data.value.useai;
          }
          /*  */
          if (e.data.name === "upscaled") {
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.download = "upscaled." + e.data.value.ext;
            a.href = e.data.value.src;
            a.click();
            //
            window.setTimeout(function () {
              a.remove();
            }, 300);
          }
        }
      }
    }
  }
};

config.port.connect();
background.receive("stop", config.app.stop);

window.addEventListener("load", config.load, false);
window.addEventListener("message", config.message, false);
window.addEventListener("resize", config.resize.method, false);