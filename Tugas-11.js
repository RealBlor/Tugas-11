// array untuk list
let Task = [];

// state filter "all", "active", "done"
let currentFilter = "all";

$(document).ready(function () {
    const $input = $("#listInput");
    const $addBtn = $("#addBtn");
    const $list = $("#todoList");
    const $activeCount = $("#activeCount");

    // tambahkan item baru
    function addTask(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        const item = { id: Date.now() + Math.floor(Math.random()*1000), text: trimmed, done: false };
        Task.push(item);
        render();
        $input.val("").focus();
    }

    // daftar sesuai filter
    function render() {
        $list.empty();
        const visible = Task.filter(it => {
            if (currentFilter === "active") return !it.done;
            if (currentFilter === "done") return it.done;
            return true;
        });

        for (const it of visible) {
            const $li = $("<li>").addClass("item").attr("data-id", it.id);
            const $label = $("<span>").addClass("label").text(it.text);
            const $btnDone = $("<button>").addClass("done").attr("title","Tandai selesai").text(it.done ? "↺" : "✔");
            const $btnDelete = $("<button>").addClass("delete").attr("title","Hapus").text("🗑️");

            if (it.done) $li.addClass("bought");

            // toggle done
            $btnDone.on("click", function () {
                it.done = !it.done;
                render();
            });

            // hapus (animasi)
            $btnDelete.on("click", function () {
                $li.addClass("removing");
                // animasi singkat sebelum hapus
                setTimeout(function () {
                    // hapus dari array
                    Task = Task.filter(x => x.id !== it.id);
                    render();
                }, 250);
            });

            $li.append($label, $btnDone, $btnDelete);
            $list.append($li);
        }

        updateActiveCount();
    }

    function updateActiveCount() {
        const active = Task.reduce((s, it) => s + (it.done ? 0 : 1), 0);
        $activeCount.text(`Aktif: ${active}`);
    }

    // tambah
    $addBtn.on("click", function () { addTask($input.val()); });
    $input.on("keydown", function (e) { if (e.key === "Enter") addTask($input.val()); });

    // filter buttons
    $("#filterAll").on("click", function () { currentFilter = "all"; render(); });
    $("#filterActive").on("click", function () { currentFilter = "active"; render(); });
    $("#filterDone").on("click", function () { currentFilter = "done"; render(); });

    // initial render (kosong)
    render();
});
