var config = {
  "file": null,
  "data": null,
  "reader": null,
  "abortController": null,
  "parent": chrome && chrome.storage ? window : window.parent,
  "resize": {
    "timeout": null
  },
  "console": {
    "element": null
  },
  "download": {
    "element": null
  },
  "upscale": {
    "element": null
  },
  "output": {
    "inner": null,
    "element": null
  },
  "input": {
    "object": {},
    "fileio": null,
    "element": null
  },
  "nohandler": function (e) {
    if (e.target.type !== "file") {
      e.preventDefault();
    }
  },
  "loadend": function (e) {
    config.data = e.target.result;
    const image = document.createElement("img");
    /*  */
    config.input.element.appendChild(image);
    image.src = URL.createObjectURL(new Blob([config.data]));
    config.input.element.querySelector("span").setAttribute("class", "image");
    config.input.element.querySelector("span").textContent = config.file.name;
    /*  */
    const cloned = image.cloneNode(true);
    config.input.element.appendChild(cloned);
    cloned.setAttribute("original", '');
    image.setAttribute("scaled", '');
  },
  "options": {
    "scale": {
      "element": null
    },
    "apikey": {
      "element": null
    },
    "level": {
      "element": null
    },
    "toggle": {
      "element": null
    },
    "patchsize": {
      "element": null
    },
    "usepatch": {
      "element": null
    },
    "useaiclient": {
      "element": null
    },
    "usecanvas": {
      "element": null
    },
    "useaiserver": {
      "element": null
    }
  },
  "message": function (e) {
    if (e.data.from === "app") {
      if (e.data.name === "theme") {
        document.documentElement.setAttribute("theme", e.data.value.theme);
      }
      /*  */
      if (e.data.name === "storage") {
        config.app.prefs.debluraction = false;
        config.app.prefs.scale = e.data.value.scale;
        config.app.prefs.level = e.data.value.level;
        config.app.prefs.apikey = e.data.value.apikey;
        config.app.prefs.usepatch = e.data.value.usepatch;
        config.app.prefs.patchsize = e.data.value.patchsize;
        config.app.prefs.usecanvas = e.data.value.usecanvas;
        config.app.prefs.useaiclient = e.data.value.useaiclient;
        config.app.prefs.useaiserver = e.data.value.useaiserver;
        /*  */
        config.output.inner.textContent = "Preview";
        config.input.element.setAttribute("empty", '');
        config.console.element.textContent = ">> Image Upscaler is ready. \n>> Please drop an image in the above area (left side) to start upscaler.";
        /*  */
        config.app.update();
      }
    }
  },
  "handle": {
    "file": function (file) {
      if (file) {
        if (file.type) {
          if (file.type.indexOf("image/") === -1) return;
          /*  */
          config.file = file;
          config.output.inner.textContent = '';
          config.input.element.removeAttribute("empty");
          config.download.element.removeAttribute("href");
          config.download.element.removeAttribute("title");
          config.download.element.removeAttribute("download");
          config.input.element.querySelector("span").removeAttribute("class");
          [...config.input.element.querySelectorAll("img")].map(e => e.remove());
          /*  */
          config.reader.readAsArrayBuffer(config.file);
        }
      }
    }
  },
  "load": function () {
    config.input.element = document.getElementById("fileio");
    config.output.element = document.getElementById("output");
    config.upscale.element = document.getElementById("upscale");
    config.console.element = document.getElementById("console");
    config.download.element = document.getElementById("download");
    config.options.scale.element = document.getElementById("scale");
    config.options.level.element = document.getElementById("level");
    config.options.apikey.element = document.getElementById("apikey");
    config.options.toggle.element = document.querySelector(".toggle");
    config.input.fileio = document.querySelector("input[type='file']");
    config.options.usepatch.element = document.getElementById("usepatch");
    config.options.patchsize.element = document.getElementById("patchsize");
    config.options.usecanvas.element = document.getElementById("usecanvas");
    config.options.useaiclient.element = document.getElementById("useaiclient");
    config.options.useaiserver.element = document.getElementById("useaiserver");
    /*  */
    config.reader = new FileReader();
    config.output.inner = config.output.element.children[0];
    /*  */
    config.reader.addEventListener("loadend", config.loadend, false)
    config.upscale.element.addEventListener("click", config.app.render, false);
    config.options.scale.element.addEventListener("change", config.app.store, false);
    config.options.apikey.element.addEventListener("change", config.app.store, false);
    config.options.level.element.addEventListener("change", config.app.store, false);
    config.options.usepatch.element.addEventListener("change", config.app.store, false);
    config.options.patchsize.element.addEventListener("change", config.app.store, false);
    config.input.fileio.addEventListener("change", function (e) {config.handle.file(e.target.files[0])}, false);
    /*  */
    config.options.toggle.element.addEventListener("click", function (e) {
      let status = e.target.getAttribute("status");
      status = status === "show" ? "hide" : "show";
      /*  */
      e.target.setAttribute("status", status);
      config.options.apikey.element.setAttribute("type", status === "show" ? "text" : "password");
    });
    /*  */
    config.options.usecanvas.element.addEventListener("change", function (e) {
      if (e.target.checked) {
        config.options.useaiclient.element.checked = false;
        config.options.useaiserver.element.checked = false;
      }
      //
      config.app.store();
    }, false);
    /*  */
    config.options.useaiclient.element.addEventListener("change", function (e) {
      if (e.target.checked) {
        config.options.usecanvas.element.checked = false;
        config.options.useaiserver.element.checked = false;
      }
      //
      config.app.store();
    }, false);
    /*  */
    config.options.useaiserver.element.addEventListener("change", function (e) {
      if (e.target.checked) {
        config.options.usecanvas.element.checked = false;
        config.options.useaiclient.element.checked = false;
      }
      //
      config.app.store();
    }, false);
    /*  */
    config.download.element.addEventListener("click", function () {
      const upscaled = config.output.inner.querySelector("img");
      /*  */
      if (upscaled) {
        if (upscaled.src) {
          if (upscaled.src.indexOf("data:image") !== -1) {
            config.parent.postMessage({
              "from": "sandbox",
              "name": "upscaled",
              "value": {
                "src": upscaled.src,
                "ext": config.file.type.replace("image/", '')
              }
            }, '*');
          }
        }
      }
    });
    /*  */
    const summaries = [];
    summaries[0] = document.querySelector("div[for='usecanvas']");
    summaries[1] = document.querySelector("summary[for='useaiclient']");
    summaries[2] = document.querySelector("summary[for='useaiserver']");
    /*  */
    summaries.forEach(function (summary) {
      if (summary) {
        const div = summary.querySelector("div");
        if (div) {
          div.addEventListener("click", function (e) {
            try {
              const item = this.parentNode;
              const details = item.parentNode;
              const id = item.getAttribute("for");
              const input = document.getElementById(id);
              /*  */
              if (details) input.click();
              e.stopPropagation();
              e.preventDefault();
            } catch (e) {}
          });
        }
      }
    });
    /*  */
    window.removeEventListener("load", config.load, false);
  },
  "app": {
    "prefs": {},
    "update": function () {
      if (config.abortController) config.abortController.abort();
      if (config.app.prefs.useaiclient) {
        const scale = Number(config.app.prefs.scale.replace('x', ''));
        if (scale > 8) {
          config.app.prefs.scale = "8x";
        }
      }
      /*  */
      if (config.app.prefs.useaiserver) {
        const scale = Number(config.app.prefs.scale.replace('x', ''));
        if (scale > 4) {
          config.app.prefs.scale = "4x";
        }
      }
      /*  */
      const apikey = document.querySelector("#options .apikey");
      const mode = config.app.prefs.useaiclient ? "ai-client" : (config.app.prefs.useaiserver ? "ai-server" : (config.app.prefs.usecanvas ? "canvas" : "unknown"));
      /*  */
      document.documentElement.setAttribute("mode", mode);
      config.options.scale.element.value = config.app.prefs.scale;
      config.options.level.element.value = config.app.prefs.level;
      config.options.apikey.element.value = config.app.prefs.apikey;
      config.options.patchsize.element.value = config.app.prefs.patchsize;
      config.options.usepatch.element.checked = config.app.prefs.usepatch;
      config.options.usecanvas.element.checked = config.app.prefs.usecanvas;
      config.options.useaiclient.element.checked = config.app.prefs.useaiclient;
      config.options.useaiserver.element.checked = config.app.prefs.useaiserver;
      /*  */
      config.options.level.element.disabled = config.app.prefs.useaiclient === false;
      config.options.apikey.element.disabled = config.app.prefs.useaiserver === false;
      config.options.usepatch.element.disabled = config.app.prefs.useaiclient === false;
      config.options.patchsize.element.disabled = config.app.prefs.useaiclient === false;
      apikey.setAttribute("state", config.app.prefs.useaiserver === false ? "disabled" : "enabled");
    },
    "store": function () {
      const scale = config.options.scale.element.value;
      const level = config.options.level.element.value;
      const apikey = config.options.apikey.element.value;
      const patchsize = config.options.patchsize.element.value;
      const usepatch = config.options.usepatch.element.checked;
      const usecanvas = config.options.usecanvas.element.checked;
      const useaiclient = config.options.useaiclient.element.checked;
      const useaiserver = config.options.useaiserver.element.checked;
      /*  */
      config.app.prefs.scale = scale;
      config.app.prefs.level = level;
      config.app.prefs.apikey = apikey;
      config.app.prefs.usepatch = usepatch;
      config.app.prefs.patchsize = patchsize;
      config.app.prefs.usecanvas = usecanvas;
      config.app.prefs.useaiclient = useaiclient;
      config.app.prefs.useaiserver = useaiserver;
      /*  */
      config.parent.postMessage({"name": "scale", "from": "sandbox", "value": {"scale": config.app.prefs.scale}}, '*');
      config.parent.postMessage({"name": "level", "from": "sandbox", "value": {"level": config.app.prefs.level}}, '*');
      config.parent.postMessage({"name": "apikey", "from": "sandbox", "value": {"apikey": config.app.prefs.apikey}}, '*');
      config.parent.postMessage({"name": "usepatch", "from": "sandbox", "value": {"usepatch": config.app.prefs.usepatch}}, '*');
      config.parent.postMessage({"name": "patchsize", "from": "sandbox", "value": {"patchsize": config.app.prefs.patchsize}}, '*');
      config.parent.postMessage({"name": "usecanvas", "from": "sandbox", "value": {"usecanvas": config.app.prefs.usecanvas}}, '*');
      config.parent.postMessage({"name": "useaiclient", "from": "sandbox", "value": {"useaiclient": config.app.prefs.useaiclient}}, '*');
      config.parent.postMessage({"name": "useaiserver", "from": "sandbox", "value": {"useaiserver": config.app.prefs.useaiserver}}, '*');
      /*  */
      config.app.update();
    },
    "tfjs": {
      "custom": {
        "layers": function (scale) {
          const _scale = scale;
          //
          const isTensorArray = (inputs) => {
            return Array.isArray(inputs);
          };
          //
          const getInput = (inputs) => {
            if (isTensorArray(inputs)) {
              return inputs[0];
            }
            return inputs;
          };
          //
          class MultiplyBeta extends tf.layers.Layer {
            beta;
            constructor() {
              super({});
              this.beta = 0.2;
            }
            call(inputs) {
              return tf.mul(getInput(inputs), this.beta);
            }
            static className = "MultiplyBeta";
          }
          //
          class PixelShuffle extends tf.layers.Layer {
            scale = _scale;
            constructor() {
              super({});
            }
            computeOutputShape(inputShape) {
              return [inputShape[0], inputShape[1], inputShape[2], 3,];
            }
            call(inputs) {
              return tf.depthToSpace(getInput(inputs), this.scale, "NHWC");
            }
            static className = `PixelShuffle${scale}x`;
          }
          //
          tf.serialization.SerializationMap.register(PixelShuffle);
          tf.serialization.SerializationMap.register(MultiplyBeta);
          //
          return [MultiplyBeta, PixelShuffle];
        }
      }
    },
    "render": async function () {
      config.app.update();
      /*  */
      if (config.data) {
        if (config.app.prefs.usecanvas) {
          const upscaled = document.createElement("img");
          const scale = Number(config.app.prefs.scale.replace('x', ''));
          const input = config.input.element.querySelector("img[original]");
          /*  */
          config.output.inner.textContent = '';
          upscaled.src = "resources/loader.gif";
          config.output.inner.appendChild(upscaled);
          config.output.inner.setAttribute("loading", '');
          config.console.element.textContent = ">> Image upscaler is in progress, please wait...";
          /*  */
          window.setTimeout(function () {
            const canvas = document.createElement("canvas");
            config.output.element.appendChild(canvas);
            canvas.width = Number(input.naturalWidth) * scale;
            canvas.height = Number(input.naturalHeight) * scale;
            /*  */
            const context = canvas.getContext("2d");
            context.drawImage(input, 0, 0, canvas.width, canvas.height);
            /*  */
            config.output.inner.textContent = '';
            config.output.inner.appendChild(upscaled);
            config.output.inner.removeAttribute("loading");
            upscaled.src = canvas.toDataURL(config.file.type, 1.0);
            config.download.element.title = "Click to download upscaled image file";
            config.console.element.textContent = ">> Image upscaler is done! \n>> Please click on the download button to save the upscaled image.";
            /*  */
            canvas.remove();
          }, 300);
        } else if (config.app.prefs.useaiserver) {
          if (config.app.prefs.apikey) {
            const upscaled = document.createElement("img");
            const scale = Number(config.app.prefs.scale.replace('x', ''));
            /*  */
            config.output.inner.textContent = '';
            upscaled.src = "resources/loader.gif";
            config.output.inner.appendChild(upscaled);
            config.output.inner.setAttribute("loading", '');
            config.console.element.textContent = ">> Image upscaler is in progress, please wait...";
            /*  */
            const form = new FormData();
            form.append("image_file", config.file);
            form.append("upscale", scale);
            /*  */
            fetch("https://clipdrop-api.co/super-resolution/v1", {
              "body": form,
              "method": "POST",
              "headers": {
                "x-api-key": config.app.prefs.apikey
              }
            }).then(r => r.arrayBuffer()).then(buffer => {
              const reader = new FileReader();
              const data = new Blob([buffer], {"type": config.file.type});
              /*  */
              reader.onload = function (e) {
                upscaled.src = e.target.result;
                /*  */
                upscaled.onload = function () {
                  config.output.inner.removeAttribute("loading");
                  config.download.element.title = "Click to download image file";
                  config.console.element.textContent = ">> Image upscale is done! \n>> Please click on the download button to save the upscaled image file.";
                };
              };
              /*  */
              reader.readAsDataURL(data);
            }).catch(function () {
              config.console.element.textContent = ">> An unexpected error happened! Please try again.";
            });
          } else {
            config.console.element.textContent = ">> Error! please add your Clipdrop API key and try again!";
          }
        } else if (config.app.prefs.useaiclient) {
          if (Upscaler) {
            const level = config.app.prefs.level;
            const table = document.createElement("table");
            const upscaled = document.createElement("img");
            const canvas = document.createElement("canvas");
            const scale = Number(config.app.prefs.scale.replace('x', ''));
            const input = config.input.element.querySelector("img[original]");
            /*  */
            config.output.inner.textContent = '';
            upscaled.src = "resources/loader.gif";
            config.output.element.appendChild(canvas);
            config.output.inner.appendChild(upscaled);
            config.abortController = new AbortController();
            config.output.inner.setAttribute("loading", '');
            canvas.width = Number(input.naturalWidth) * scale;
            canvas.height = Number(input.naturalHeight) * scale;
            /*  */
            const context = canvas.getContext("2d");
            const pixels = await tf.browser.fromPixels(input);
            const upscaler = new Upscaler({
              "model": {
                "scale": scale,
                "path": "vendor/models/" + level + "/x" + scale + "/model.json",
                ...(level === "thick") && ({"customLayers": config.app.tfjs.custom.layers(scale)})
              }
            });
            /*  */
            if (config.app.prefs.usepatch === false) {
              config.output.inner.appendChild(upscaled);
              config.console.element.textContent = ">> Image upscaler is in progress, please wait...";
              try {
                upscaled.src = await upscaler.upscale(pixels, {
                  "signal": config.abortController.signal
                });
              } catch (e) {
                config.console.element.textContent = ">> The image upscaling process is canceled!";
              }
              /*  */
              upscaled.onload = function (e) {
                config.output.inner.scrollTop = 0;
                config.output.inner.removeAttribute("loading");
                context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
                config.download.element.title = "Click to download image file";
                config.console.element.textContent = ">> Image upscale is done! \n>> Please click on the download button to save the upscaled image file.";
              };
              /*  */
              canvas.remove();
            } else {
              const padding = 0;
              const process = "pre";
              const current = {"tr": null, "row": 0, "col": 0};
              const patchSize = Number(config.app.prefs.patchsize);
              /*  */
              current.tr = document.createElement("tr");
              config.console.element.textContent = ">> Image upscaler is warming up, please wait...";
              await upscaler.warmup({"padding": padding, "patchSize": patchSize});
              /*  */
              table.appendChild(current.tr);
              config.output.inner.textContent = '';
              config.output.inner.appendChild(table);
              config.output.inner.removeAttribute("loading");
              config.console.element.textContent = ">> Image upscaler is in progress, please wait...";
              /*  */
              try {
                await upscaler.upscale(pixels, {
                  "padding": padding,
                  "patchSize": patchSize,
                  "awaitNextFrame": true,
                  "signal": config.abortController.signal,
                  "progress": function (percent, slice, metrics) {
                    const td = document.createElement("td");
                    const slicedimg = document.createElement("img");
                    /*  */
                    slicedimg.src = slice;
                    slicedimg.dataset.dy = metrics.row * scale * patchSize;
                    slicedimg.dataset.dx = metrics.col * scale * patchSize;
                    /*  */
                    config.output.inner.scrollTop = config.output.inner.scrollHeight;
                    config.console.element.textContent = ">> Image upscaler progress " + Math.floor(percent * 100) + '%' + ", please wait...";
                    td.appendChild(slicedimg);
                    /*  */
                    if (percent < 1 && metrics.row > current.row) {
                      current.tr = document.createElement("tr");
                      table.appendChild(current.tr);
                      current.row = metrics.row;
                    }
                    /*  */
                    current.tr.appendChild(td);
                    /*  */
                    if (process === "pre") {
                      slicedimg.onload = function (e) {
                        const image = e.target;
                        const dwidth = image.naturalWidth
                        const dheight = image.naturalHeight;
                        const dx = Number(image.dataset.dx);
                        const dy = Number(image.dataset.dy);
                        /*  */
                        context.drawImage(image, dx, dy, dwidth, dheight);
                      };
                    }
                  }
                });
              } catch (e) {
                config.console.element.textContent = ">> The image upscaling process is canceled!";
              }
              /*  */
              if (process === "post") {
                const rows = [...table.rows];
                for (var i = 0; i < rows.length; i++) {
                  const cells = [...rows[i].cells];
                  for (var j = 0; j < cells.length; j++) {
                    const image = cells[j].querySelector("img");
                    const dx = j * scale * patchSize;
                    const dy = i * scale * patchSize;
                    const dwidth = image.naturalWidth;
                    const dheight = image.naturalHeight;
                    /*  */
                    if (image) {
                      context.drawImage(image, dx, dy, dwidth, dheight);
                    }
                  }  
                }
              }
              /*  */
              config.console.element.textContent = ">> Image upscaler is done! \n>> Please click on the download button to save the upscaled image.";
            }
            /*  */
            window.setTimeout(function () {
              table.remove();
              config.output.inner.scrollTop = 0;
              config.output.inner.textContent = '';
              config.output.inner.appendChild(upscaled);
              upscaled.src = canvas.toDataURL(config.file.type, 1.0);
              config.download.element.title = "Click to download upscaled image file";
              /*  */
              canvas.remove();
              /*  */
              if (config.app.prefs.debluraction) {
                const deblurlistener = function () {
                  const deblur = document.createElement("canvas");
                  deblur.height = Number(input.naturalHeight);
                  deblur.width = Number(input.naturalWidth);
                  config.output.element.appendChild(deblur);
                  deblur.setAttribute("deblur", '');
                  /*  */
                  const context = deblur.getContext("2d");
                  context.imageSmoothingEnabled = false;
                  context.drawImage(upscaled, 0, 0, deblur.width, deblur.height);
                  upscaled.src = deblur.toDataURL(config.file.type, 1.0);
                  upscaled.removeEventListener("load", deblurlistener);
                  /*  */
                  deblur.remove();
                };
                /*  */
                upscaled.addEventListener("load", deblurlistener);
              }
            }, 300);
            /*  */
            await upscaler.dispose();
          } else {
            config.console.element.textContent = ">> Error! image upscaler API is not loaded!";
          }
        } else {
          config.console.element.textContent = ">> Please select an upscale method (#1, #2 or #3) and try again.";
        }
      } else {
        config.console.element.textContent = ">> Please drop an image in the above field and then try again...";
      }
    }
  }
};

window.addEventListener("load", config.load, false);
window.addEventListener("drop", config.nohandler, false);
window.addEventListener("message", config.message, false);
window.addEventListener("dragover", function (e) {e.preventDefault()});
