document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MENÚ DESPLEGABLE
    // ==========================================
    const btnMenu = document.getElementById('btn-menu');
    const menuDesplegable = document.getElementById('menu-desplegable');

    if (btnMenu && menuDesplegable) {
        btnMenu.addEventListener('click', (e) => {
            e.stopPropagation(); 
            menuDesplegable.classList.toggle('abierto');
        });

        document.addEventListener('click', (e) => {
            if (!menuDesplegable.contains(e.target) && e.target !== btnMenu) {
                menuDesplegable.classList.remove('abierto');
            }
        });
    }

    // ==========================================
    // 2. CARGAR DATOS DINÁMICOS (JSON)
    // ==========================================
    Promise.all([
        fetch('../json/secciones.json').then(r => r.json()),
        fetch('../json/albumes.json').then(r => r.json()),
        fetch('../json/artistas.json').then(r => r.json())
    ])
    .then(([secciones, albumes, artistas]) => {
        const data = { ...secciones, ...albumes, ...artistas };
            
            // --- A) NOVEDADES ---
            const carruselInfinito = document.querySelector('.carrusel-infinito');
            if (carruselInfinito && data.novedades) {
                const generarTarjetasNovedades = () => {
                    return data.novedades.map(album => `
                        <a href="album.html?id=${album.id}" class="tarjeta-album" style="text-decoration:none; color:inherit; display:block;">
                            <div class="portada-placeholder" style="background-image: url('${encodeURI(album.cover)}'); background-size: cover; background-position: center; border: none; color: transparent;"></div>
                            <h3>${album.titulo}</h3>
                            <p>${album.artista}</p>
                        </a>
                    `).join('');
                };
                carruselInfinito.innerHTML = generarTarjetasNovedades() + generarTarjetasNovedades();
            }

            // --- B) TENDENCIAS PRINCIPALES ---
            const tendenciasContenedor = document.querySelector('.tendencias-principales');
            if (tendenciasContenedor && data.tendenciasPrincipales) {
                tendenciasContenedor.innerHTML = data.tendenciasPrincipales.map(album => `
                    <a href="album.html?id=${album.id}" class="tarjeta-destacada" style="text-decoration:none; color:inherit; display:block;">
                        <div class="portada-grande" style="background-image: url('${encodeURI(album.cover)}'); background-size: cover; background-position: center; border: none; color: transparent;"></div>
                        <h3>${album.titulo}</h3>
                        <p class="meta-info">${album.meta}</p>
                        <div class="estrellas">${album.nota}</div>
                        <p class="sinopsis">${album.sinopsis}</p>
                    </a>
                `).join('');
            }

            // --- C) SUB TENDENCIAS ---
            const subTendenciasContenedor = document.querySelector('.sub-tendencias');
            if (subTendenciasContenedor && data.subTendencias) {
                subTendenciasContenedor.innerHTML = data.subTendencias.map(album => `
                    <a href="album.html?id=${album.id}" class="tarjeta-mini-album" style="text-decoration:none; color:inherit; display:block;">
                        <div class="portada-chica" style="background-image: url('${album.cover}'); background-size: cover; background-position: center; border: none; color: transparent;"></div>
                        <div class="info-mini-album">
                            <h4>${album.titulo}</h4>
                            <p>${album.artista}</p>
                        </div>
                    </a>
                `).join('');
            }

            // --- D) RESEÑAS ---
            const resenasContenedor = document.querySelector('.lista-resenas');
            if (resenasContenedor && data.resenas) {
                resenasContenedor.innerHTML = data.resenas.map(resena => {
                    let resenaId = resena.id;
                    if (!resenaId && data.albumesDetalle) {
                        for (const [key, alb] of Object.entries(data.albumesDetalle)) {
                            if (alb.titulo === resena.album && alb.artista === resena.artista) {
                                resenaId = key; break;
                            }
                        }
                    }
                    const href = resenaId ? `href="album.html?id=${resenaId}"` : '';
                    return `
                    <div class="bloque-resena">
                        <div class="resena-lateral">
                            <a ${href} style="display:block; text-decoration:none;">
                                <img src="${encodeURI(resena.cover)}" alt="${resena.album}" class="resena-portada" style="object-fit: cover; border: none; cursor: ${resenaId ? 'pointer' : 'default'}">
                            </a>
                        </div>
                        <div class="resena-cuerpo">
                            <div class="resena-info-cabecera">
                                <div class="album-meta">
                                    <div class="album-titulos">
                                        <a ${href} style="text-decoration:none; color:inherit;"><h3>${resena.album}</h3></a>
                                        <span class="resena-artista">de ${resena.artista}</span>
                                    </div>
                                    <span class="resena-anio">${resena.anio}</span>
                                </div>
                                <div class="resena-nota-numerica">${resena.nota}</div>
                            </div>
                            <div class="resena-usuario">
                                <div class="resena-avatar" style="background-color: ${resena.colorUsuario};"></div>
                                <span class="resena-username">${resena.usuario}</span>
                            </div>
                            <p class="resena-parrafo">"${resena.texto}"</p>
                            <div class="resena-interaccion">
                                <span class="accion-item"><span class="icon-mini">♥</span> ${resena.likes}</span>
                                <span class="accion-item"><span class="icon-mini">💬</span> ${resena.comentarios}</span>
                            </div>
                        </div>
                    </div>
                `}).join('');
            }

            // --- E) ARTISTAS DESTACADOS ---
            const contenedorSlider = document.getElementById('artistas-slider-contenedor');
            if (contenedorSlider && data.artistas) {
                const htmlArtistas = data.artistas.map(artista => `
                    <div class="tarjeta-artista" onclick="window.location.href='artista.html?id=${artista.id}'">
                        <div class="avatar-artista" style="background-image: url('${artista.foto}'); background-size: cover; background-position: center; border: none; color: transparent;"></div>
                        <h4>${artista.nombre}</h4>
                        <p class="artista-genero">${artista.genero}</p>
                    </div>
                `).join('');
                
                contenedorSlider.innerHTML = htmlArtistas;

                configurarCarrusel('artistas-slider-contenedor', 'btn-artista-prev', 'btn-artista-next', '.tarjeta-artista');
            }

            // --- F) CARGAR DETALLE DE ÁLBUM (album.html) ---
            const urlParams = new URLSearchParams(window.location.search);
            const albumId = urlParams.get('id');
            
            if (albumId && data.albumesDetalle && data.albumesDetalle[albumId]) {
                const album = data.albumesDetalle[albumId];
                
                const elTitulo = document.getElementById('album-titulo');
                if(elTitulo) elTitulo.textContent = album.titulo;
                
                const elArtista = document.getElementById('album-artista');
                if(elArtista) {
                    let artistaIdLink = '';
                    if (data.artistasDetalle) {
                        const artistaEncontrado = Object.entries(data.artistasDetalle).find(([id, art]) => art.nombre === album.artista);
                        if (artistaEncontrado) {
                            artistaIdLink = artistaEncontrado[0];
                        }
                    }
                    if (artistaIdLink) {
                        elArtista.innerHTML = `<a href="artista.html?id=${artistaIdLink}" style="color: inherit; text-decoration: none; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">${album.artista}</a>`;
                    } else {
                        elArtista.textContent = album.artista;
                    }
                }
                
                const elCover = document.getElementById('album-cover');
                if(elCover) elCover.src = album.cover;
                
                const elFecha = document.getElementById('album-fecha');
                if(elFecha) elFecha.textContent = album.fecha;
                
                const elDuracion = document.getElementById('album-duracion');
                if(elDuracion) elDuracion.textContent = album.tracklist.length + " canciones, " + album.duracion;
                
                const elSubmeta = document.querySelector('.album-submeta');
                if(elSubmeta) elSubmeta.textContent = album.fecha + " · " + album.tracklist.length + " canciones, " + album.duracion;
                
                const elTipo = document.getElementById('album-tipo');
                if(elTipo && album.tipo) elTipo.textContent = album.tipo;

                const elGeneros = document.getElementById('album-generos');
                if(elGeneros && album.generos) elGeneros.textContent = album.generos;

                const elSubgeneros = document.getElementById('album-subgeneros');
                if(elSubgeneros && album.subgenero) elSubgeneros.textContent = album.subgenero;

                const elIdioma = document.getElementById('album-idioma');
                if(elIdioma && album.idioma) elIdioma.textContent = album.idioma;

                const elSello = document.getElementById('album-sello');
                if(elSello && album.sello) elSello.textContent = album.sello;

                const elProductor = document.getElementById('album-productor');
                if(elProductor && album.productor) elProductor.textContent = album.productor;

                const elFormato = document.getElementById('album-formato');
                if(elFormato && album.formato) elFormato.textContent = album.formato;
                
                const elRatingCard = document.getElementById('album-rating');
                if(elRatingCard) {
                    const numero = elRatingCard.querySelector('.cs-numero');
                    if(numero) numero.innerHTML = `<span class="numero-grande">${album.rating}</span><span class="numero-chico">/10</span>`;
                }
                
                const elRatingsCount = document.getElementById('album-ratings-count');
                if(elRatingsCount) elRatingsCount.textContent = "Basado en " + album.ratingsCount;
                
                const elTracklist = document.getElementById('album-tracklist');
                if(elTracklist && album.tracklist) {
                    let totalSegundos = 0;
                    elTracklist.innerHTML = album.tracklist.map(track => {
                        if (track.duracion) {
                            const partes = track.duracion.split(':');
                            if(partes.length === 2) {
                                totalSegundos += parseInt(partes[0]) * 60 + parseInt(partes[1]);
                            }
                        }
                        return `
                        <li class="track-item">
                            <span class="tr-num">${track.numero}</span>
                            <span class="tr-titulo">${track.titulo}</span>
                            <span class="tr-duracion">${track.duracion}</span>
                        </li>
                    `}).join('');
                    
                    const min = Math.floor(totalSegundos / 60);
                    const seg = totalSegundos % 60;
                    const duracionStr = `${min}:${seg.toString().padStart(2, '0')}`;
                    
                    const elFooterDuracion = document.querySelector('.tracklist-footer span:last-child');
                    if (elFooterDuracion) {
                        elFooterDuracion.textContent = duracionStr;
                    }
                }
                
                const gridRecomendaciones = document.getElementById('album-recomendaciones-grid');
                if(gridRecomendaciones && album.recomendaciones) {
                    gridRecomendaciones.style.display = 'grid';
                    gridRecomendaciones.style.gridTemplateColumns = 'repeat(4, 1fr)';
                    gridRecomendaciones.style.gap = '15px';
                    gridRecomendaciones.innerHTML = album.recomendaciones.slice(0, 4).map(rec => {
                        let recId = rec.id;
                        if (!recId && data.albumesDetalle) {
                            for (const [key, alb] of Object.entries(data.albumesDetalle)) {
                                if (alb.titulo === rec.titulo && alb.artista === rec.artista) {
                                    recId = key; break;
                                }
                            }
                        }
                        const href = recId ? `href="album.html?id=${recId}"` : '';
                        return `
                        <a ${href} class="album-mini" style="min-width: 0; text-decoration:none; color:inherit; display:block; cursor: ${recId ? 'pointer' : 'default'}">
                            <div class="portada-rel" style="background-image: url('${rec.cover}'); background-size: cover; background-position: center;"></div>
                            <h4>${rec.titulo}</h4>
                            <p>${rec.anio || ''}</p>
                        </a>
                    `}).join('');
                }
                
                const gridSimilares = document.getElementById('album-similares-grid');
                if(gridSimilares && album.similares) {
                    gridSimilares.style.display = 'grid';
                    gridSimilares.style.gridTemplateColumns = 'repeat(4, 1fr)';
                    gridSimilares.style.gap = '15px';
                    gridSimilares.innerHTML = album.similares.slice(0, 4).map(sim => {
                        let simId = sim.id;
                        if (!simId && data.albumesDetalle) {
                            for (const [key, alb] of Object.entries(data.albumesDetalle)) {
                                if (alb.titulo === sim.titulo && alb.artista === sim.artista) {
                                    simId = key; break;
                                }
                            }
                        }
                        const href = simId ? `href="album.html?id=${simId}"` : '';
                        return `
                        <a ${href} class="album-mini" style="min-width: 0; text-decoration:none; color:inherit; display:block; cursor: ${simId ? 'pointer' : 'default'}">
                            <div class="portada-rel" style="background-image: url('${sim.cover}'); background-size: cover; background-position: center;"></div>
                            <h4>${sim.titulo}</h4>
                            <p>${sim.artista || ''} ${sim.anio || ''}</p>
                        </a>
                    `}).join('');
                }
            } // CIERRA EL IF DE ALBUMID

            // --- G) CARGAR DETALLE DE ARTISTA (artista.html) ---
            const artistaId = urlParams.get('id');
            
            if (artistaId && data.artistasDetalle && data.artistasDetalle[artistaId]) {
                const artista = data.artistasDetalle[artistaId];
                
                document.title = artista.nombre + ' - Perfil del Artista';
                
                const fotoEl = document.getElementById('artista-foto');
                if(fotoEl) fotoEl.src = artista.fotoPerfil;
                
                const nombreEl = document.getElementById('artista-nombre');
                if(nombreEl) nombreEl.textContent = artista.nombre;
                
                const bioEl = document.querySelector('.artista-bio');
                if(bioEl) bioEl.textContent = artista.biografia;
                
                const seguidoresEl = document.querySelector('.seguidores-count-simple strong');
                if(seguidoresEl) seguidoresEl.textContent = artista.seguidores;
                
                const metadataVals = document.querySelectorAll('.meta-row .meta-val');
                if (metadataVals[0]) metadataVals[0].textContent = artista.genero || '-';
                if (metadataVals[1]) metadataVals[1].textContent = artista.añosActivos || '-';
                if (metadataVals[2]) metadataVals[2].textContent = artista.origen || '-';
                if (metadataVals[3]) metadataVals[3].textContent = artista.miembros || '-';

                const redesContenedor = document.querySelector('.redes-artista');
                if (redesContenedor && artista.redes) {
                    redesContenedor.innerHTML = '';
                    if(artista.redes.spotify) {
                        redesContenedor.innerHTML += `<a href="${artista.redes.spotify}" target="_blank" class="icono-red" title="Spotify"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 11.5c2.5-1 6-1 8 0M8 14.5c2-.5 5-.5 7 0M9 17.5c1.5-.5 3.5-.5 5 0"></path></svg></a>`;
                    }
                    if(artista.redes.instagram) {
                        redesContenedor.innerHTML += `<a href="${artista.redes.instagram}" target="_blank" class="icono-red" title="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>`;
                    }
                }
                
                let albumesDelArtista = [];
                if (data.albumesDetalle) {
                    albumesDelArtista = Object.entries(data.albumesDetalle)
                        .filter(([id, alb]) => alb.artista === artista.nombre)
                        .map(([id, alb]) => ({id, ...alb}));
                }

                const discoGrid = document.querySelector('.discografia-grid');
                if(discoGrid) {
                    if(albumesDelArtista.length > 0) {
                        discoGrid.innerHTML = albumesDelArtista.map(alb => `
                            <a href="album.html?id=${alb.id}" class="album-card" style="text-decoration:none; color:inherit; display:block;">
                                <div class="portada-album" style="background-image: url('${alb.cover}'); background-size: cover; background-position: center; border-radius: 8px;"></div>
                                <h4 style="margin-top:10px; font-size:1.05rem;">${alb.titulo}</h4>
                                <p style="color:var(--texto-secundario); font-size:0.85rem;">${alb.fecha ? alb.fecha.substring(alb.fecha.length - 4) : ''} • ${alb.tipo || 'Álbum'}</p>
                            </a>
                        `).join('');
                    } else {
                        discoGrid.innerHTML = '<p style="color:var(--texto-secundario);">No hay álbumes cargados todavía.</p>';
                    }
                }
                
                const popularTracks = document.querySelector('.tracklist');
                if(popularTracks) {
                    let allTracks = [];
                    albumesDelArtista.forEach(alb => {
                        if (alb.tracklist) {
                            alb.tracklist.forEach(t => {
                                allTracks.push({ track: t, album: alb });
                            });
                        }
                    });
                    
                    if (allTracks.length > 0) {
                        const topTracks = allTracks.slice(0, 5); // Tomamos las primeras 5 canciones
                        popularTracks.innerHTML = topTracks.map((t, index) => `
                            <a href="album.html?id=${t.album.id}" class="track-item" style="text-decoration:none; color:inherit; display:flex; align-items:center; padding:10px; border-radius:8px; transition:background-color 0.2s;">
                                <span class="tr-num" style="width:30px; text-align:center; color:var(--texto-secundario); font-size:1rem; flex-shrink: 0;">${index + 1}</span>
                                <div class="tr-portada" style="background-image: url('${t.album.cover}'); width:40px; height:40px; border-radius:4px; margin-right:15px; background-size:cover; flex-shrink: 0;"></div>
                                <span class="tr-titulo" style="flex-grow:1; font-weight:500;">${t.track.titulo}</span>
                                <span class="tr-duracion" style="color:var(--texto-secundario); font-size:0.9rem; flex-shrink: 0;">${t.track.duracion || ''}</span>
                            </a>
                        `).join('');
                    } else {
                        popularTracks.innerHTML = '<p style="color:var(--texto-secundario); margin-left: 15px;">No hay canciones cargadas todavía.</p>';
                    }
                }

                const grids = document.querySelectorAll('.discografia-grid');
                if (grids.length >= 2) {
                    const similaresGrid = grids[1];
                    const generosArtista = artista.genero ? artista.genero.split(',').map(g => g.trim().toLowerCase()) : [];
                    
                    let similares = [];
                    if (data.artistasDetalle) {
                        similares = Object.entries(data.artistasDetalle).filter(([id, art]) => {
                            if (id === artistaId) return false;
                            if (!art.genero) return false;
                            const generosSim = art.genero.split(',').map(g => g.trim().toLowerCase());
                            return generosArtista.some(g => generosSim.includes(g));
                        }).map(([id, art]) => ({id, ...art}));
                    }
                    
                    if (similares.length > 0) {
                        similaresGrid.innerHTML = similares.slice(0, 5).map(sim => `
                            <a href="artista.html?id=${sim.id}" class="album-card artista-similar-card" style="text-decoration:none; color:inherit; display:block;">
                                <div class="portada-album" style="background-image: url('${sim.fotoPerfil}'); background-size: cover; background-position: center; border-radius: 50%;"></div>
                                <h4 style="text-align: center; margin-top:10px;">${sim.nombre}</h4>
                                <p style="text-align: center; color:var(--texto-secundario); font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sim.genero}</p>
                            </a>
                        `).join('');
                    } else {
                        similaresGrid.innerHTML = '<p style="color:var(--texto-secundario); grid-column: 1 / -1;">No se encontraron artistas similares todavía.</p>';
                    }
                }
            }

            // Mostrar el contenedor de forma fluida una vez cargados los datos para evitar parpadeos
            const albumContainer = document.querySelector('.album-container');
            if (albumContainer) {
                albumContainer.style.opacity = '1';
            }
            const artistaContainer = document.querySelector('.artista-container');
            if (artistaContainer) {
                artistaContainer.style.opacity = '1';
            }

        })
        .catch(error => console.error('Error al cargar datos.json:', error));


    // ==========================================
    // 3. LÓGICA DEL CARRUSEL DE ARTISTAS
    // ==========================================
    function configurarCarrusel(contenedorId, prevBtnId, nextBtnId, tarjetaClase) {
        const contenedorSlider = document.getElementById(contenedorId);
        const btnPrev = document.getElementById(prevBtnId);
        const btnNext = document.getElementById(nextBtnId);
        
        if (!contenedorSlider) return;

        let isAnimating = false;

        contenedorSlider.style.display = 'flex';
        contenedorSlider.style.flexWrap = 'nowrap';
        
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                const tarjetas = contenedorSlider.querySelectorAll(tarjetaClase);
                if (tarjetas.length === 0) { isAnimating = false; return; }

                const shift = tarjetas[0].offsetWidth + 35;

                contenedorSlider.style.transition = 'transform 0.4s ease-in-out';
                contenedorSlider.style.transform = `translateX(-${shift}px)`;

                const handleNext = () => {
                    contenedorSlider.removeEventListener('transitionend', handleNext);
                    contenedorSlider.appendChild(contenedorSlider.firstElementChild);
                    contenedorSlider.style.transition = 'none';
                    contenedorSlider.style.transform = 'translateX(0)';
                    setTimeout(() => { isAnimating = false; }, 50);
                };
                contenedorSlider.addEventListener('transitionend', handleNext);
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                const tarjetas = contenedorSlider.querySelectorAll(tarjetaClase);
                if (tarjetas.length === 0) { isAnimating = false; return; }

                const shift = tarjetas[0].offsetWidth + 35;

                contenedorSlider.insertBefore(contenedorSlider.lastElementChild, contenedorSlider.firstElementChild);

                contenedorSlider.style.transition = 'none';
                contenedorSlider.style.transform = `translateX(-${shift}px)`;

                void contenedorSlider.offsetWidth;

                contenedorSlider.style.transition = 'transform 0.4s ease-in-out';
                contenedorSlider.style.transform = 'translateX(0)';

                const handlePrev = () => {
                    contenedorSlider.removeEventListener('transitionend', handlePrev);
                    isAnimating = false;
                };
                contenedorSlider.addEventListener('transitionend', handlePrev);
            });
        }
    }



    // ==========================================
    // 4. LÓGICA DE BÚSQUEDA Y FILTRO
    // ==========================================
    const btnFiltro = document.getElementById('btn-filtro');
    const filtroDropdown = document.getElementById('filtro-dropdown');
    const inputBuscador = document.getElementById('input-buscador');
    const inputAnio = document.getElementById('filtro-input-anio');
    const contenedorGeneros = document.getElementById('filtros-generos');

    const contenedorTipos = document.getElementById('filtros-tipos');

    // Cargar filtros dinámicamente si los contenedores existen
    if (contenedorGeneros && contenedorTipos) {
        fetch('../json/albumes.json')
            .then(response => response.json())
            .then(data => {
                if (!data.albumesDetalle) return;
                
                const predefinedGenres = {
                    "Pop": ["Pop (General)", "K-Pop", "Dance-Pop", "Synth-Pop", "Art Pop", "Electropop", "Hyperpop", "Alternative Pop", "Latin Pop", "Dream Pop", "Chamber Pop"],
                    "Hip-Hop / Rap": ["Hip-Hop (General)", "Rap", "Trap", "Experimental Hip-Hop", "Pop Rap", "Old School Hip-Hop", "Rage", "Plugg", "Southern Trap"],
                    "Electronic / Dance": ["Electronic (General)", "Dance", "House", "Techno", "Ambient", "UK Garage", "Jersey Club", "EDM", "Drone"],
                    "Rock / Alternative": ["Rock (General)", "Alternative", "Indie Rock", "Post-Punk", "New Wave", "Folk Rock", "Singer-Songwriter", "Rap Rock"],
                    "R&B / Soul / Funk": ["R&B (General)", "Contemporary R&B", "Alternative R&B", "Soul", "Neo-Soul", "Funk", "Disco"],
                    "Otros": ["Afrobeat", "Jazz", "Prog Metal", "Reggae"]
                };
                const types = new Set();
                
                Object.values(data.albumesDetalle).forEach(album => {
                    
                    if (album.tipo) {
                        let tipo = album.tipo.trim();
                        if (tipo.toLowerCase() === 'full album') tipo = 'Álbum';
                        types.add(tipo);
                    }
                });
                const sortedTypes = Array.from(types).sort();

                const renderList = (items, typeName) => {
                    if (items.length === 0) return '<p class="filtro-label" style="opacity:0.5;">No hay opciones</p>';
                    return items.map(item => `
                        <label class="filtro-label">
                            <input type="checkbox" class="filtro-checkbox" value="${item}" data-tipo="${typeName}">
                            ${item}
                        </label>
                    `).join('');
                };

                const renderGenres = (gMap) => {
                    const sortedMain = Object.keys(gMap);
                    return sortedMain.map(mg => {
                        const subs = gMap[mg];
                        const subOptions = subs.map(sg => {
                            const val = sg.replace(" (General)", "");
                            return `
                                <label class="filtro-label">
                                    <input type="checkbox" class="filtro-checkbox" value="${val}" data-tipo="genero">
                                    ${sg}
                                </label>
                            `;
                        }).join('');
                        
                        return `
                            <div class="filtro-subcategoria">
                                <label class="filtro-label" style="width:100%; display:flex; justify-content:space-between; cursor:default;">
                                    <span>${mg}</span>
                                    <span style="font-size:0.6rem; opacity:0.5;">▶</span>
                                </label>
                                <div class="filtro-sub-submenu">
                                    ${subOptions}
                                </div>
                            </div>
                        `;
                    }).join('');
                };

                contenedorTipos.innerHTML = renderList(sortedTypes, 'tipo');
                contenedorGeneros.innerHTML = renderGenres(predefinedGenres);
                
                // Marcar inputs y checkboxes segun URL params
                const urlParams = new URLSearchParams(window.location.search);
                const queryYear = urlParams.get('y') || '';
                const queryGenres = urlParams.get('g') ? urlParams.get('g').split(',') : [];
                const queryTypes = urlParams.get('t') ? urlParams.get('t').split(',') : [];
                const buscarEn = urlParams.get('en') || 'album';
                
                if (inputAnio && queryYear) {
                    inputAnio.value = queryYear;
                }
                
                document.querySelectorAll('.filtro-checkbox[data-tipo="genero"]').forEach(cb => {
                    if (queryGenres.includes(cb.value)) cb.checked = true;
                });
                document.querySelectorAll('.filtro-checkbox[data-tipo="tipo"]').forEach(cb => {
                    if (queryTypes.includes(cb.value)) cb.checked = true;
                });
                
                if (filtroDropdown) {
                    const buscarEn = urlParams.get('en') || 'todo';
                    const radioTarget = document.querySelector(`.filtro-radio[value="${buscarEn}"]`);
                    if (radioTarget) radioTarget.checked = true;
                }
            })
            .catch(err => {
                console.error('Error al cargar filtros:', err);
                contenedorTipos.innerHTML = '<p style="color:red; font-size:12px;">Error cargando datos</p>';
                contenedorGeneros.innerHTML = '<p style="color:red; font-size:12px;">Error cargando datos</p>';
            });
    }

    // Lógica para bloquear filtros si se busca en Usuarios o Listas
    const radiosBuscarEn = document.querySelectorAll('.filtro-radio[name="buscarEn"]');
    const catsExtras = [document.getElementById('categoria-tipo'), document.getElementById('categoria-anios'), document.getElementById('categoria-generos')];
    
    const actCat = (val) => {
        const disabledCats = val === 'usuario' || val === 'lista' || val === 'todo';
        catsExtras.forEach(c => {
            if (c) {
                c.style.opacity = disabledCats ? '0.3' : '1';
                c.style.pointerEvents = disabledCats ? 'none' : 'auto';
            }
        });
    };

    radiosBuscarEn.forEach(r => {
        r.addEventListener('change', (e) => actCat(e.target.value));
        if (r.checked) actCat(r.value);
    });

    // Toggle dropdown
    if (btnFiltro && filtroDropdown) {
        btnFiltro.addEventListener('click', (e) => {
            e.stopPropagation();
            filtroDropdown.classList.toggle('abierto');
        });

        document.addEventListener('click', (e) => {
            if (!filtroDropdown.contains(e.target) && e.target !== btnFiltro) {
                filtroDropdown.classList.remove('abierto');
            }
        });
    }

    // Ejecutar búsqueda
    const ejecutarBusqueda = () => {
        if (!inputBuscador) return;
        const query = inputBuscador.value.trim();
        
        const checkedGenres = Array.from(document.querySelectorAll('.filtro-checkbox[data-tipo="genero"]:checked')).map(cb => cb.value);
        const checkedTypes = Array.from(document.querySelectorAll('.filtro-checkbox[data-tipo="tipo"]:checked')).map(cb => cb.value);
        const targetRadio = document.querySelector('.filtro-radio:checked');
        const buscarEn = targetRadio ? targetRadio.value : 'todo';
        const anioFiltro = inputAnio ? inputAnio.value.trim() : '';
        
        let url = 'resultados.html?';
        const params = new URLSearchParams();
        
        if (query) params.append('q', query);
        if (buscarEn) params.append('en', buscarEn);
        if (anioFiltro) params.append('y', anioFiltro);
        if (checkedGenres.length > 0) params.append('g', checkedGenres.join(','));
        if (checkedTypes.length > 0) params.append('t', checkedTypes.join(','));
        
        window.location.href = url + params.toString();
    };

    if (inputBuscador) {
        inputBuscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                ejecutarBusqueda();
            }
        });

        // --- INICIO AUTOCOMPLETADO ---
        let autocompleteData = null;
        const navBuscador = inputBuscador.closest('.nav-buscador');
        
        if (navBuscador) {
            const sugerenciasContainer = document.createElement('div');
            sugerenciasContainer.id = 'buscador-sugerencias';
            sugerenciasContainer.className = 'sugerencias-dropdown';
            navBuscador.appendChild(sugerenciasContainer);

            inputBuscador.addEventListener('focus', () => {
                if (!autocompleteData) {
                    Promise.all([
                        fetch('../json/albumes.json').then(r => r.json()),
                        fetch('../json/artistas.json').then(r => r.json())
                    ]).then(([albumesData, artistasData]) => {
                        const albumes = albumesData.albumesDetalle ? Object.values(albumesData.albumesDetalle) : [];
                        const artistas = artistasData.artistasDetalle ? Object.values(artistasData.artistasDetalle) : [];
                        autocompleteData = [
                            ...albumes.map(a => ({...a, tipoObj: 'Álbum'})), 
                            ...artistas.map(a => ({...a, tipoObj: 'Artista'}))
                        ];
                    }).catch(err => console.error('Error cargando datos para autocompletado', err));
                }
            });

            inputBuscador.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                sugerenciasContainer.innerHTML = '';
                
                if (query.length < 2 || !autocompleteData) {
                    sugerenciasContainer.classList.remove('activo');
                    return;
                }

                const resultados = autocompleteData.filter(item => {
                    const titulo = (item.titulo || '').toLowerCase();
                    const nombre = (item.nombre || '').toLowerCase();
                    const artista = (item.artista || '').toLowerCase();
                    return titulo.includes(query) || nombre.includes(query) || artista.includes(query);
                }).slice(0, 5);

                if (resultados.length > 0) {
                    resultados.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'sugerencia-item';
                        
                        const titulo = item.titulo || item.nombre;
                        const subtitulo = item.tipoObj === 'Álbum' ? item.artista : 'Artista';
                        const imagenSrc = item.cover || item.fotoPerfil || '';

                        let imgHTML = '';
                        if (imagenSrc) {
                            imgHTML = `<img src="${imagenSrc}" alt="${titulo}" class="sugerencia-imagen" onerror="this.style.display='none'">`;
                        } else {
                            imgHTML = `<div class="sugerencia-imagen" style="display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg></div>`;
                        }

                        div.innerHTML = `
                            ${imgHTML}
                            <div class="sugerencia-info">
                                <span class="sugerencia-titulo">${titulo}</span>
                                <span class="sugerencia-tipo">${subtitulo}</span>
                            </div>
                        `;

                        div.addEventListener('click', () => {
                            inputBuscador.value = titulo;
                            sugerenciasContainer.classList.remove('activo');
                            ejecutarBusqueda();
                        });

                        sugerenciasContainer.appendChild(div);
                    });
                    sugerenciasContainer.classList.add('activo');
                } else {
                    sugerenciasContainer.innerHTML = '<div class="sugerencia-vacia">No hay coincidencias</div>';
                    sugerenciasContainer.classList.add('activo');
                }
            });

            document.addEventListener('click', (e) => {
                if (!inputBuscador.contains(e.target) && !sugerenciasContainer.contains(e.target)) {
                    sugerenciasContainer.classList.remove('activo');
                }
            });
        }
        // --- FIN AUTOCOMPLETADO ---
    }

    const btnLupa = document.querySelector('.icono-lupa');
    if (btnLupa) {
        btnLupa.style.cursor = 'pointer';
        btnLupa.addEventListener('click', ejecutarBusqueda);
    }

    // ==========================================
    // 5. RENDERIZAR RESULTADOS (resultados.html)
    // ==========================================
    const gridResultados = document.getElementById('resultados-grid');
    const tituloResultados = document.getElementById('titulo-resultados');
    
    if (gridResultados && tituloResultados) {
        const queryParams = new URLSearchParams(window.location.search);
        const query = queryParams.get('q');
        const filterYears = queryParams.get('y') ? queryParams.get('y').split(',') : [];
        const filterGenres = queryParams.get('g') ? queryParams.get('g').split(',') : [];
        const filterTypes = queryParams.get('t') ? queryParams.get('t').split(',') : [];
        const enParam = queryParams.get('en');
        const buscarEn = enParam || 'todo';

        if (query || filterYears.length > 0 || filterGenres.length > 0 || filterTypes.length > 0 || enParam) {
            
            let titulo = "Resultados";
            if (query) titulo += ` para: "${query}"`;
            tituloResultados.textContent = titulo;
            
            if (buscarEn === 'usuario') {
                gridResultados.innerHTML = `<p class="no-resultados">La búsqueda de usuarios no está disponible en este momento.</p>`;
                return;
            }
            
            fetch('../json/albumes.json')
                .then(response => response.json())
                .then(data => {
                    if (!data.albumesDetalle) return;

                    const queryLower = query ? query.toLowerCase() : '';
                    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const queryRegex = queryLower ? new RegExp('\\b' + escapeRegExp(queryLower), 'i') : null;
                    const resultados = [];
                    
                    const sortByMatch = (arr, getStr) => {
                        if (!queryLower) return arr;
                        return arr.sort((a, b) => {
                            const strA = getStr(a).toLowerCase();
                            const strB = getStr(b).toLowerCase();
                            const aStarts = strA.startsWith(queryLower) ? 1 : 0;
                            const bStarts = strB.startsWith(queryLower) ? 1 : 0;
                            return bStarts - aStarts; // 1 goes first
                        });
                    };

                    const albumesList = Object.keys(data.albumesDetalle).map(key => ({
                        id: key,
                        ...data.albumesDetalle[key]
                    }));

                    if (buscarEn === 'todo') {
                        const resAlbumes = [];
                        const resArtistasMap = new Map();
                        const resCanciones = [];

                        albumesList.forEach(album => {
                            const tituloLower = (album.titulo || '').toLowerCase();
                            const artistaLower = (album.artista || '').toLowerCase();
                            
                            // Álbumes
                            if (!queryRegex || queryRegex.test(tituloLower)) {
                                resAlbumes.push(album);
                            }
                            
                            // Artistas
                            if (!queryRegex || queryRegex.test(artistaLower)) {
                                if (!resArtistasMap.has(artistaLower)) {
                                    resArtistasMap.set(artistaLower, {
                                        nombre: album.artista,
                                        cover: album.cover
                                    });
                                }
                            }
                            
                            // Canciones
                            if (album.tracklist) {
                                album.tracklist.forEach(track => {
                                    const trackTituloLower = (track.titulo || '').toLowerCase();
                                    if (!queryRegex || queryRegex.test(trackTituloLower)) {
                                        resCanciones.push({ track, album });
                                    }
                                });
                            }
                        });

                        const resArtistas = Array.from(resArtistasMap.values());

                        if (resAlbumes.length === 0 && resArtistas.length === 0 && resCanciones.length === 0) {
                            gridResultados.innerHTML = `<p class="no-resultados">No se encontraron resultados para "${query}".</p>`;
                            gridResultados.style.display = 'block';
                            return;
                        }

                        let htmlContent = '';
                        const limite = 5;

                        const crearHeader = (titulo, enlace, mostrarVerMas) => `
                            <div class="seccion-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 25px;">
                                <h2 style="color: var(--texto-principal); font-size: 1.5rem; margin: 0;">${titulo}</h2>
                                ${mostrarVerMas ? `<a href="${enlace}" class="enlace-ver-mas" style="color: var(--color-acento); text-decoration: none; font-size: 0.95rem; font-weight: 500;">Ver más</a>` : ''}
                            </div>
                        `;

                        const separador = `<hr style="border: 0; border-bottom: 1px solid var(--borde); margin: 60px 0; width: 100%;">`;
                        let seccionesAgregadas = 0;

                        if (resAlbumes.length > 0) {
                            if (seccionesAgregadas > 0) htmlContent += separador;
                            sortByMatch(resAlbumes, x => x.titulo || '');
                            const mostrarVerMas = resAlbumes.length > limite;
                            const albumesMostrar = resAlbumes.slice(0, limite);
                            
                            htmlContent += crearHeader('Álbumes', `resultados.html?q=${encodeURIComponent(query)}&en=album`, mostrarVerMas);
                            htmlContent += `<div class="resultados-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; width: 100%; margin-bottom: 50px;">`;
                            htmlContent += albumesMostrar.map(album => `
                                <a href="album.html?id=${album.id}" class="tarjeta-album" style="text-decoration:none; color:inherit; display:block;">
                                    <div class="portada-placeholder" style="background-image: url('${album.cover}'); background-size: cover; background-position: center; border: none; color: transparent; border-radius: 8px;"></div>
                                    <h3 style="margin-top: 10px; font-size: 1.1rem; color: var(--texto-principal);">${album.titulo}</h3>
                                    <p style="color: var(--texto-secundario); font-size: 0.9rem;">${album.artista}</p>
                                </a>
                            `).join('');
                            htmlContent += `</div>`;
                            seccionesAgregadas++;
                        }

                        if (resArtistas.length > 0) {
                            if (seccionesAgregadas > 0) htmlContent += separador;
                            sortByMatch(resArtistas, x => x.nombre || '');
                            const mostrarVerMas = resArtistas.length > limite;
                            const artistasMostrar = resArtistas.slice(0, limite);
                            
                            htmlContent += crearHeader('Artistas', `resultados.html?q=${encodeURIComponent(query)}&en=artista`, mostrarVerMas);
                            htmlContent += `<div class="resultados-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; width: 100%; margin-bottom: 50px;">`;
                            htmlContent += artistasMostrar.map(art => `
                                <a href="artista.html" class="tarjeta-album" style="text-decoration:none; color:inherit; display:flex; flex-direction: column; align-items: center; text-align: center;">
                                    <div class="portada-placeholder" style="background-image: url('${art.cover}'); background-size: cover; background-position: center; border: none; color: transparent; border-radius: 50%; width: 150px; height: 150px; margin: 0 auto 15px auto;"></div>
                                    <h3 style="margin-top: 5px; font-size: 1.1rem; color: var(--texto-principal);">${art.nombre}</h3>
                                    <p style="color: var(--texto-secundario); font-size: 0.9rem;">Artista</p>
                                </a>
                            `).join('');
                            htmlContent += `</div>`;
                            seccionesAgregadas++;
                        }

                        if (resCanciones.length > 0) {
                            if (seccionesAgregadas > 0) htmlContent += separador;
                            sortByMatch(resCanciones, x => x.track.titulo || '');
                            const mostrarVerMas = resCanciones.length > limite;
                            const cancionesMostrar = resCanciones.slice(0, limite);
                            
                            htmlContent += crearHeader('Canciones', `resultados.html?q=${encodeURIComponent(query)}&en=cancion`, mostrarVerMas);
                            htmlContent += `<div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 50px;">`;
                            htmlContent += cancionesMostrar.map(c => `
                                <a href="album.html?id=${c.album.id}" class="track-item" style="display: flex; align-items: center; padding: 10px; border-radius: 8px; text-decoration: none; background-color: var(--fondo-tarjeta); transition: background-color 0.2s; border: 1px solid var(--borde);">
                                    <div class="tr-portada" style="background-image: url('${c.album.cover}'); width: 48px; height: 48px; border-radius: 6px; margin-right: 15px; background-size: cover; flex-shrink: 0;"></div>
                                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                                        <span class="tr-titulo" style="color: var(--texto-principal); font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;">${c.track.titulo}</span>
                                        <span style="color: var(--texto-secundario); font-size: 0.9rem;">${c.album.artista}</span>
                                    </div>
                                    <span class="tr-duracion" style="color: var(--texto-secundario); font-weight: 500; margin-right: 15px;">${c.track.duracion || ''}</span>
                                </a>
                            `).join('');
                            htmlContent += `</div>`;
                        }

                        gridResultados.className = ''; 
                        gridResultados.style.display = 'block';
                        gridResultados.innerHTML = htmlContent;

                    } else {
                        const resultados = [];
                        albumesList.forEach(album => {
                            let coincideTexto = true;
                            let coincideAnio = true;
                            let coincideGenero = true;
                            let coincideTipo = true;

                            if (queryRegex) {
                                if (buscarEn === 'album') {
                                    const tituloLower = (album.titulo || '').toLowerCase();
                                    if (!queryRegex.test(tituloLower)) coincideTexto = false;
                                } else if (buscarEn === 'artista') {
                                    const artistaLower = (album.artista || '').toLowerCase();
                                    if (!queryRegex.test(artistaLower)) coincideTexto = false;
                                } else if (buscarEn === 'cancion') {
                                    const tieneCancion = album.tracklist && album.tracklist.some(t => queryRegex.test((t.titulo || '').toLowerCase()));
                                    if (!tieneCancion) coincideTexto = false;
                                }
                            }

                            if (filterTypes.length > 0) {
                                let tipoNorm = album.tipo ? album.tipo.trim() : '';
                                if (tipoNorm.toLowerCase() === 'full album') tipoNorm = 'Álbum';
                                if (!tipoNorm || !filterTypes.includes(tipoNorm)) coincideTipo = false;
                            }

                            if (filterYears.length > 0) {
                                const anioAlbum = album.fecha ? album.fecha.match(/\b(19|20)\d{2}\b/) : null;
                                if (!anioAlbum || !filterYears.includes(anioAlbum[0])) coincideAnio = false;
                            }

                            if (filterGenres.length > 0) {
                                const generoLower = (album.generos || album.subgenero || album.géneros || album.subgénero || '').toLowerCase();
                                const tieneGenero = filterGenres.some(g => generoLower.includes(g.toLowerCase()));
                                if (!tieneGenero) coincideGenero = false;
                            }

                            if (coincideTexto && coincideAnio && coincideGenero && coincideTipo) {
                                resultados.push(album);
                            }
                        });

                        if (resultados.length === 0) {
                            gridResultados.className = '';
                            gridResultados.style.display = 'block';
                            gridResultados.innerHTML = `<p class="no-resultados">No se encontraron resultados que coincidan con tu búsqueda y filtros.</p>`;
                        } else if (buscarEn === 'artista') {
                            const artistasUnicos = new Map();
                            resultados.forEach(album => {
                                if (!artistasUnicos.has(album.artista)) {
                                    artistasUnicos.set(album.artista, { nombre: album.artista, cover: album.cover });
                                }
                            });
                            const artistasArr = Array.from(artistasUnicos.values());
                            sortByMatch(artistasArr, x => x.nombre || '');
                            
                            gridResultados.className = 'resultados-grid';
                            gridResultados.style.display = 'grid';
                            gridResultados.innerHTML = artistasArr.map(art => `
                                <a href="artista.html" class="tarjeta-album" style="text-decoration:none; color:inherit; display:flex; flex-direction: column; align-items: center; text-align: center;">
                                    <div class="portada-placeholder" style="background-image: url('${art.cover}'); background-size: cover; background-position: center; border: none; color: transparent; border-radius: 50%; width: 150px; height: 150px; margin: 0 auto 15px auto;"></div>
                                    <h3 style="margin-top: 5px; font-size: 1.1rem; color: var(--texto-principal);">${art.nombre}</h3>
                                    <p style="color: var(--texto-secundario); font-size: 0.9rem;">Artista</p>
                                </a>
                            `).join('');
                        } else if (buscarEn === 'cancion') {
                            const cancionesUnicas = [];
                            resultados.forEach(album => {
                                if (album.tracklist) {
                                    album.tracklist.forEach(track => {
                                        if (!queryRegex || queryRegex.test((track.titulo || '').toLowerCase())) {
                                            cancionesUnicas.push({ track, album });
                                        }
                                    });
                                }
                            });
                            sortByMatch(cancionesUnicas, x => x.track.titulo || '');
                            
                            gridResultados.className = '';
                            gridResultados.style.display = 'block';
                            gridResultados.innerHTML = `<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">` + 
                                cancionesUnicas.map(c => `
                                <a href="album.html?id=${c.album.id}" class="track-item" style="display: flex; align-items: center; padding: 10px; border-radius: 8px; text-decoration: none; background-color: var(--fondo-tarjeta); transition: background-color 0.2s; border: 1px solid var(--borde);">
                                    <div class="tr-portada" style="background-image: url('${c.album.cover}'); width: 48px; height: 48px; border-radius: 6px; margin-right: 15px; background-size: cover; flex-shrink: 0;"></div>
                                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                                        <span class="tr-titulo" style="color: var(--texto-principal); font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;">${c.track.titulo}</span>
                                        <span style="color: var(--texto-secundario); font-size: 0.9rem;">${c.album.artista}</span>
                                    </div>
                                    <span class="tr-duracion" style="color: var(--texto-secundario); font-weight: 500; margin-right: 15px;">${c.track.duracion || ''}</span>
                                </a>
                                `).join('') + `</div>`;
                        } else {
                            // Álbum o por defecto
                            sortByMatch(resultados, x => x.titulo || '');
                            gridResultados.className = 'resultados-grid';
                            gridResultados.style.display = 'grid';
                            gridResultados.innerHTML = resultados.map(album => `
                                <a href="album.html?id=${album.id}" class="tarjeta-album" style="text-decoration:none; color:inherit; display:block;">
                                    <div class="portada-placeholder" style="background-image: url('${album.cover}'); background-size: cover; background-position: center; border: none; color: transparent; border-radius: 8px;"></div>
                                    <h3>${album.titulo}</h3>
                                    <p>${album.artista}</p>
                                </a>
                            `).join('');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error al cargar resultados:', error);
                    gridResultados.innerHTML = `<p class="no-resultados">Hubo un error al buscar los resultados.</p>`;
                });
        } else {
            tituloResultados.textContent = "Búsqueda vacía";
            gridResultados.innerHTML = `<p class="no-resultados">Ingresá un término de búsqueda o selecciona un filtro para comenzar.</p>`;
        }
    }

});
