/* =====================================================
   LOOKOUT VIRTUAL MOUSE CONTROLLER
   ===================================================== */

/*
   This file contains only the LookOut UI/controller layer
   for the virtual mouse.

   The actual hand/gesture recognition remains in:
   gesture-web.js

   It exposes:
       window.startWebGestureControl()
       window.stopWebGestureControl()
*/

const gestureToggle =
    document.querySelector(
        ".top-toggle input"
    );

const virtualCursor =
    document.getElementById(
        "virtualCursor"
    );

window.addEventListener(
    "mousemove",
    (e) => {

        if (
            document.body.classList.contains(
                "virtual-cursor-enabled"
            )
        ) {

            virtualCursor.style.left =
                `${e.clientX}px`;

            virtualCursor.style.top =
                `${e.clientY}px`;
        }
    }
);

window.addEventListener(
    "mousedown",
    () => {

        virtualCursor.classList.add(
            "active"
        );
    }
);

window.addEventListener(
    "mouseup",
    () => {

        virtualCursor.classList.remove(
            "active"
        );
    }
);

if (gestureToggle) {

    gestureToggle.addEventListener(
        "change",
        async () => {

            if (gestureToggle.checked) {

                try {

                    if (!window.startWebGestureControl) {
                        throw new Error(
                            "Gesture controller is still loading"
                        );
                    }

                    await window.startWebGestureControl();

                    console.log(
                        "Browser gesture control started"
                    );

                } catch (error) {

                    console.error(error);

                    alert(
                        "Gesture control needs camera permission and a secure browser context."
                    );

                    gestureToggle.checked = false;

                    document.body.classList.remove(
                        "virtual-cursor-enabled"
                    );
                }

            } else {

                if (window.stopWebGestureControl) {
                    window.stopWebGestureControl();
                }

                console.log(
                    "Browser gesture control stopped"
                );
            }
        }
    );
}
