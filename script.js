
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menu && nav) {
        menu.addEventListener("click", () => nav.classList.toggle("mobile-open"));
        nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("mobile-open")));
    }

    document.querySelectorAll(".lang").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".lang").forEach(x => x.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // Package calculator
    let selected = null;
    const packages = document.querySelectorAll(".package");
    const extras = document.querySelectorAll(".option input");
    const styles = document.querySelectorAll(".style-card input");

    const selectedPackage = document.getElementById("selectedPackage");
    const extraCount = document.getElementById("extraCount");
    const extraNames = document.getElementById("extraNames");
    const selectedStyle = document.getElementById("selectedStyle");
    const totalPrice = document.getElementById("totalPrice");
    const estimatedTime = document.getElementById("estimatedTime");

    const money = value => value ? new Intl.NumberFormat("hu-HU").format(value) : "—";

    function calculate() {
        const chosenExtras = [...extras].filter(x => x.checked);
        const style = document.querySelector(".style-card input:checked")?.value || "Sötét / prémium";

        if (extraCount) extraCount.textContent = chosenExtras.length;
        if (extraNames) extraNames.textContent = chosenExtras.length
            ? chosenExtras.map(x => x.dataset.extra).join(", ")
            : "—";
        if (selectedStyle) selectedStyle.textContent = style.toUpperCase();

        if (!selected) {
            if (selectedPackage) selectedPackage.textContent = "VÁLASSZ EGY CSOMAGOT A KALKULÁCIÓ INDÍTÁSÁHOZ.";
            if (totalPrice) totalPrice.textContent = "—";
            if (estimatedTime) estimatedTime.textContent = "—";
            return;
        }

        const extraTotal = chosenExtras.reduce((s,x) => s + Number(x.dataset.price || 0), 0);
        const total = selected.price + extraTotal;

        selectedPackage.textContent = `${selected.name} — ${money(selected.price)} FT`;
        totalPrice.textContent = money(total);

        if (selected.name.includes("STARTER")) estimatedTime.textContent = "1–2 HÉT";
        else if (selected.name.includes("BEMUTATKOZÓ")) estimatedTime.textContent = "2–3 HÉT";
        else if (selected.name.includes("WEBSHOP")) estimatedTime.textContent = "4–6 HÉT";
        else estimatedTime.textContent = "EGYEZTETÉS ALAPJÁN";
    }

    packages.forEach(card => {
        const btn = card.querySelector("button");
        if (!btn) return;
        btn.addEventListener("click", () => {
            packages.forEach(x => x.classList.remove("selected"));
            card.classList.add("selected");
            selected = {
                name: card.querySelector("h2").textContent,
                price: Number(card.dataset.price || 0)
            };
            calculate();
            document.querySelector(".calculator")?.scrollIntoView({behavior:"smooth"});
        });
    });

    extras.forEach(x => x.addEventListener("change", calculate));
    styles.forEach(x => x.addEventListener("change", calculate));

    document.getElementById("resetBtn")?.addEventListener("click", () => {
        selected = null;
        packages.forEach(x => x.classList.remove("selected"));
        extras.forEach(x => x.checked = false);
        const dark = document.querySelector('.style-card input[value="Sötét / prémium"]');
        if (dark) dark.checked = true;
        calculate();
    });

    document.getElementById("offerBtn")?.addEventListener("click", () => {
        if (!selected) {
            alert("Először válassz egy csomagot!");
            return;
        }
        const chosen = [...extras].filter(x => x.checked).map(x => x.dataset.extra);
        const style = document.querySelector(".style-card input:checked")?.value || "";
        const subject = encodeURIComponent("Weboldal ajánlatkérés");
        const body = encodeURIComponent(
            `Csomag: ${selected.name}\nBecsült ár: ${totalPrice.textContent} Ft\n` +
            `Extrák: ${chosen.length ? chosen.join(", ") : "nincs"}\nDesign: ${style}`
        );
        window.location.href = `mailto:szivospatrikdavid@gmail.com?subject=${subject}&body=${body}`;
    });

    // General quote form
    const form = document.getElementById("quoteForm");
    const formMessage = document.getElementById("formMessage");
    form?.addEventListener("submit", e => {
        e.preventDefault();
        const data = new FormData(form);
        const body = [...data.entries()].map(([k,v]) => `${k}: ${v}`).join("\n");
        const subject = encodeURIComponent("Új weboldal ajánlatkérés");
        window.location.href =
            `mailto:szivospatrikdavid@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
        if (formMessage) formMessage.textContent = "Az e-mail kliens megnyitása folyamatban...";
    });

    calculate();
});
