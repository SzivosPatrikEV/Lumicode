document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("quoteForm");
    const formMessage = document.getElementById("formMessage");

    const successModal = document.getElementById("successModal");
    const successModalClose = document.getElementById("successModalClose");
    const successModalOk = document.getElementById("successModalOk");


    /* ========================================
       SIKERES KÜLDÉS — POPUP MEGNYITÁSA
       ======================================== */

    function openSuccessModal() {

        if (!successModal) return;

        successModal.classList.add("show");

        successModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    /* ========================================
       POPUP BEZÁRÁSA
       ======================================== */

    function closeSuccessModal() {

        if (!successModal) return;

        successModal.classList.remove(
            "show"
        );

        successModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* ========================================
       POPUP GOMBOK
       ======================================== */

    if (successModalClose) {

        successModalClose.addEventListener(
            "click",
            closeSuccessModal
        );

    }


    if (successModalOk) {

        successModalOk.addEventListener(
            "click",
            closeSuccessModal
        );

    }


    /* ========================================
       HÁTTÉRRE KATTINTÁS
       ======================================== */

    if (successModal) {

        const backdrop =
            successModal.querySelector(
                ".success-modal-backdrop"
            );

        if (backdrop) {

            backdrop.addEventListener(
                "click",
                closeSuccessModal
            );

        }
    }


    /* ========================================
       ESC BILLENTYŰ
       ======================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                successModal &&
                successModal.classList.contains("show")
            ) {

                closeSuccessModal();

            }

        }
    );


    /* ========================================
       AJÁNLATKÉRÉS
       ======================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* ========================================
                   GOMB
                   ======================================== */

                const submitButton =
                    form.querySelector(
                        ".form-submit"
                    );


                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "AJÁNLATKÉRÉS ELKÜLDÉSE →";


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "KÜLDÉS FOLYAMATBAN...";

                }


                /* ========================================
                   HIBAÜZENET TÖRLÉSE
                   ======================================== */

                if (formMessage) {

                    formMessage.textContent = "";

                    formMessage.style.color = "";

                }


                try {

                    /* ========================================
                       ADATOK BEOLVASÁSA
                       ======================================== */

                    const formData =
                        new FormData(form);


                    const nev =
                        formData.get("Név") || "-";


                    const ceg =
                        formData.get("Cég") || "-";


                    const email =
                        formData.get("Email") || "-";


                    const telefon =
                        formData.get("Telefon") || "-";


                    const csomag =
                        formData.get("Csomag") || "-";


                    const hatarido =
                        formData.get("Határidő") || "-";


                    const koltsegkeret =
                        formData.get("Költségkeret") || "-";


                    const projekt =
                        formData.get("Projekt leírása") || "-";


                    /* ========================================
                       TELJES EMAIL TARTALOM
                       ======================================== */

                    const emailTartalom = `

ÚJ AJÁNLATKÉRÉS ÉRKEZETT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KAPCSOLATTARTÓ ADATAI

Név:
${nev}

Cég:
${ceg}

Email:
${email}

Telefon:
${telefon}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJEKT ADATAI

Választott csomag:
${csomag}

Kívánt határidő:
${hatarido}

Költségkeret:
${koltsegkeret}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJEKT LEÍRÁSA

${projekt}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Az ajánlatkérés a Weblume weboldalán keresztül érkezett.

${new Date().toLocaleString("hu-HU")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;


                    /* ========================================
                       EMAIL ADATOK
                       ======================================== */

                    const emailData =
                        new FormData();


                    /*
                     * A címzett
                     */

                    emailData.append(
                        "_to",
                        "szivospatrikev@gmail.com"
                    );


                    /*
                     * Email tárgya
                     */

                    emailData.append(
                        "_subject",
                        `ÚJ AJÁNLATKÉRÉS – ${nev}`
                    );


                    /*
                     * Teljes email tartalma
                     */

                    emailData.append(
                        "AJÁNLATKÉRÉS",
                        emailTartalom
                    );


                    /*
                     * Külön mezők is bekerülnek
                     * az emailbe
                     */

                    emailData.append(
                        "Név",
                        nev
                    );

                    emailData.append(
                        "Cég",
                        ceg
                    );

                    emailData.append(
                        "Email",
                        email
                    );

                    emailData.append(
                        "Telefon",
                        telefon
                    );

                    emailData.append(
                        "Csomag",
                        csomag
                    );

                    emailData.append(
                        "Határidő",
                        hatarido
                    );

                    emailData.append(
                        "Költségkeret",
                        koltsegkeret
                    );

                    emailData.append(
                        "Projekt leírása",
                        projekt
                    );


                    /*
                     * FormSubmit AJAX
                     */

                    const response =
                        await fetch(
                            "https://formsubmit.co/ajax/szivospatrikev@gmail.com",
                            {
                                method: "POST",

                                headers: {
                                    "Accept":
                                        "application/json"
                                },

                                body: emailData
                            }
                        );


                    const result =
                        await response.json();


                    /* ========================================
                       ELLENŐRZÉS
                       ======================================== */

                    if (
                        !response.ok ||
                        result.success === false
                    ) {

                        throw new Error(
                            result.message ||
                            "Az ajánlatkérés küldése sikertelen."
                        );

                    }


                    /* ========================================
                       SIKERES KÜLDÉS
                       ======================================== */

                    form.reset();

                    openSuccessModal();


                } catch (error) {

                    console.error(
                        "Ajánlatkérés hiba:",
                        error
                    );


                    /* ========================================
                       HIBAÜZENET
                       ======================================== */

                    if (formMessage) {

                        formMessage.style.color =
                            "#ff4d4d";

                        formMessage.textContent =
                            "Hiba történt az elküldés során. Kérlek, próbáld meg később újra.";

                    }

                } finally {

                    /* ========================================
                       GOMB VISSZAÁLLÍTÁSA
                       ======================================== */

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            originalText;

                    }

                }

            }
        );

    }

});