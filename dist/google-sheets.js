(() => {
    const escapeHtml = (str) => {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const init = () => {
        const url = document.body.getAttribute('data-url');
        if (!url || !url.includes('script.google.com')) {
            return;
        }

        const commentsEl = document.getElementById('comments');
        const formName = document.getElementById('form-name');
        const formPresence = document.getElementById('form-presence');
        const formComment = document.getElementById('form-comment');
        const sendBtn = document.getElementById('button-send-comment') 
            || document.querySelector('#comment button.btn-primary') 
            || document.querySelector('#comment button[onclick*="comment.send"]');

        // Auto-fill nama tamu dari query param ?to=
        if (formName) {
            const params = new URLSearchParams(window.location.search);
            const toParam = params.get('to');
            if (toParam) {
                formName.value = decodeURIComponent(toParam);
            } else {
                try {
                    const saved = localStorage.getItem('guest_name');
                    if (saved) formName.value = saved;
                } catch {}
            }
        }

        // Render card komentar
        const renderList = (items) => {
            if (!commentsEl) return;
            if (!items || items.length === 0) {
                commentsEl.innerHTML = `
                    <div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow">
                        <p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">
                            📢 Belum ada ucapan. Jadilah yang pertama memberikan ucapan & doa! 🎉
                        </p>
                    </div>`;
                return;
            }

            commentsEl.innerHTML = items.map((c) => {
                const isHadir = c.presence === true || c.presence === 'Hadir' || c.presence == '1';
                const badge = isHadir
                    ? '<i class="fa-solid fa-circle-check text-success ms-1" title="Hadir"></i>'
                    : '<i class="fa-solid fa-circle-xmark text-danger ms-1" title="Berhalangan"></i>';
                const dateStr = c.date ? escapeHtml(String(c.date)) : '';

                return `
                <div class="bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="text-theme-auto text-truncate m-0 p-0" style="font-size: 0.95rem;">
                            <strong class="me-1">${escapeHtml(c.name || 'Tamu')}</strong> ${badge}
                        </p>
                        <small class="text-theme-auto m-0 p-0" style="font-size: 0.75rem;">${dateStr}</small>
                    </div>
                    <hr class="my-1">
                    <p class="text-theme-auto my-1 mx-0 p-0" style="white-space: pre-line;">${escapeHtml(c.comment || '')}</p>
                </div>`;
            }).join('');
        };

        // Load ucapan dari Google Sheets (GET)
        const loadComments = async () => {
            if (!commentsEl) return;
            commentsEl.innerHTML = `
                <div class="text-center p-3 text-secondary">
                    <span class="spinner-border spinner-border-sm me-2"></span>Memuat ucapan...
                </div>`;

            try {
                const res = await fetch(url, { method: 'GET' });
                const json = await res.json();
                if (json && json.status === 'success' && Array.isArray(json.data)) {
                    renderList(json.data);
                } else {
                    renderList([]);
                }
            } catch (err) {
                console.warn('Gagal memuat ucapan dari Google Sheets:', err);
                renderList([]);
            }
        };

        // Kirim ucapan ke Google Sheets (POST)
        const sendComment = async (btn) => {
            const name = formName?.value?.trim() || '';
            const presence = formPresence?.value || '0';
            const comment = formComment?.value?.trim() || '';

            if (!name) {
                alert('Silakan isikan Nama Anda.');
                formName?.focus();
                return;
            }

            if (presence === '0') {
                alert('Silakan pilih Konfirmasi Presensi (Datang / Berhalangan).');
                formPresence?.focus();
                return;
            }

            if (!comment) {
                alert('Silakan tuliskan Ucapan & Doa Anda.');
                formComment?.focus();
                return;
            }

            const originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...';

            try {
                // Siapkan data dengan URLSearchParams (format application/x-www-form-urlencoded)
                const params = new URLSearchParams();
                params.append('name', name);
                params.append('presence', presence === '1' ? 'Hadir' : 'Berhalangan');
                params.append('comment', comment);

                // Kirim POST ke Web App Google Script
                await fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params.toString()
                });

                // Simpan nama ke localStorage
                try {
                    localStorage.setItem('guest_name', name);
                } catch {}

                // Buat card baru secara instan di tampilan
                const now = new Date();
                const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
                                now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                const isHadir = presence === '1';
                const badge = isHadir
                    ? '<i class="fa-solid fa-circle-check text-success ms-1" title="Hadir"></i>'
                    : '<i class="fa-solid fa-circle-xmark text-danger ms-1" title="Berhalangan"></i>';

                // Hapus placeholder kosong jika ada
                const emptyPlaceholder = commentsEl?.querySelector('.text-center');
                if (emptyPlaceholder) {
                    emptyPlaceholder.remove();
                }

                const cardDiv = document.createElement('div');
                cardDiv.className = 'bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4';
                cardDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="text-theme-auto text-truncate m-0 p-0" style="font-size: 0.95rem;">
                            <strong class="me-1">${escapeHtml(name)}</strong> ${badge}
                        </p>
                        <small class="text-theme-auto m-0 p-0" style="font-size: 0.75rem;">${escapeHtml(dateStr)}</small>
                    </div>
                    <hr class="my-1">
                    <p class="text-theme-auto my-1 mx-0 p-0" style="white-space: pre-line;">${escapeHtml(comment)}</p>
                `;

                if (commentsEl) {
                    commentsEl.prepend(cardDiv);
                }

                if (formComment) {
                    formComment.value = '';
                }

                alert('Terima kasih atas ucapan dan doa restunya!');

                // Sinkronisasi ulang data setelah 2.5 detik
                setTimeout(() => {
                    loadComments();
                }, 2500);

            } catch (err) {
                console.error('Error sending comment:', err);
                alert('Gagal mengirim ucapan. Silakan coba lagi.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        };

        // Hubungkan event click tombol kirim
        if (sendBtn) {
            sendBtn.removeAttribute('onclick');
            sendBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendComment(sendBtn);
            };
        }

        // Jalankan pemuatan komentar pertama kali
        loadComments();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
