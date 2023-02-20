const cond_1 = window === window.top;
const cond_2 = document.documentElement.getAttribute("context") === "webapp";

if (cond_1 || cond_2) {
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

  var app = {
    "addon": {
      "homepage": function () {
        return chrome.runtime.getManifest().homepage_url;
      }
    },
    "prefs": {
      set scale (val) {app.storage.write("scale", val)},
      set level (val) {app.storage.write("level", val)},
      set useai (val) {app.storage.write("useai", val)},
      set usepatch (val) {app.storage.write("usepatch", val)},
      set patchsize (val) {app.storage.write("patchsize", val)},
      get scale () {return app.storage.read("scale") !== undefined ? app.storage.read("scale") : "4x"},
      get useai () {return app.storage.read("useai") !== undefined ? app.storage.read("useai") : false},
      get level () {return app.storage.read("level") !== undefined ? app.storage.read("level") : "thick"},
      get usepatch () {return app.storage.read("usepatch") !== undefined ? app.storage.read("usepatch") : true},
      get patchsize () {return app.storage.read("patchsize") !== undefined ? app.storage.read("patchsize") : 16}
    },
    "start": async function () {
      let target = window === window.top ? document.querySelector("iframe").contentWindow : window;
      /*  */
      
      console.error(target);
      
      target.postMessage({
        "from": "app",
        "name": "storage",
        "value": {
          "scale": app.prefs.scale,
          "level": app.prefs.level,
          "useai": app.prefs.useai,
          "usepatch": app.prefs.usepatch,
          "patchsize": app.prefs.patchsize
        }
      }, '*');
    },
    "resize": {
      "timeout": null,
      "method": function () {
        if (app.port.name === "win") {
          if (app.resize.timeout) window.clearTimeout(app.resize.timeout);
          app.resize.timeout = window.setTimeout(async function () {
            let current = await chrome.windows.getCurrent();
            /*  */
            app.storage.write("interface.size", {
              "top": current.top,
              "left": current.left,
              "width": current.width,
              "height": current.height
            });
          }, 1000);
        }
      }
    },
    "port": {
      "name": '',
      "connect": function () {
        app.port.name = "webapp";
        let context = document.documentElement.getAttribute("context");
        /*  */
        if (chrome.runtime) {
          if (chrome.runtime.connect) {
            if (context !== app.port.name) {
              if (document.location.search === "?win") {
                app.port.name = "win";
              }
            }
          }
        }
        /*  */
        document.documentElement.setAttribute("context", app.port.name);
      }
    },
    "load": function () {
      const reload = document.getElementById("reload");
      const support = document.getElementById("support");
      const donation = document.getElementById("donation");
      /*  */
      if (reload) {
        reload.addEventListener("click", function () {
          document.location.reload();
        });
      }
      /*  */
      if (support) {
        support.addEventListener("click", function () {
          const url = app.addon.homepage();
          chrome.tabs.create({"url": url, "active": true});
        }, false);
      }
      /*  */
      if (donation) {
        donation.addEventListener("click", function () {
          const url = app.addon.homepage() + "?reason=support";
          chrome.tabs.create({"url": url, "active": true});
        }, false);
      }
      /*  */
      
      console.error(123);
      
      app.storage.load(app.start);
      window.removeEventListener("load", app.load, false);
    },
    "storage": {
      "local": {},
      "read": function (id) {
        return app.storage.local[id];
      },
      "load": function (callback) {
        chrome.storage.local.get(null, function (e) {
          app.storage.local = e;
          callback();
        });
      },
      "write": function (id, data) {
        if (id) {
          if (data !== '' && data !== null && data !== undefined) {
            let tmp = {};
            tmp[id] = data;
            app.storage.local[id] = data;
            chrome.storage.local.set(tmp);
          } else {
            delete app.storage.local[id];
            chrome.storage.local.remove(id);
          }
        }
      }
    },
    "message": function (e) {
      
      console.error(e);
      
      if (e) {
        if (e.data) {
          if (e.data.from === "sandbox") {
            if (e.data.name === "scale") {
              app.prefs.scale = e.data.value.scale;
            }
            /*  */
            if (e.data.name === "level") {
              app.prefs.level = e.data.value.level;
            }
            /*  */
            if (e.data.name === "patchsize") {
              app.prefs.patchsize = e.data.value.patchsize;
            }
            /*  */
            if (e.data.name === "usepatch") {
              app.prefs.usepatch = e.data.value.usepatch;
            }
            /*  */
            if (e.data.name === "useai") {
              app.prefs.useai = e.data.value.useai;
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
  //
  app.port.connect();
  //
  window.addEventListener("load", app.load, false);
  window.addEventListener("message", app.message, false);
  window.addEventListener("resize", app.resize.method, false);
}