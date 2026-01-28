import React, { useState, useEffect, useRef } from 'react';

interface TileAnimation {
    duration: number;
    tileid: number;
}

interface Tile {
    animation?: TileAnimation[];
    id: number;
    image?: string;
    imageheight?: number;
    imagewidth?: number;
}

interface Tileset {
    columns: number;
    firstgid: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tiles?: Tile[];
    tilewidth: number;
}

interface Layer {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
    offsetx?: number;
    offsety?: number;
}

interface MapData {
    compressionlevel: number;
    height: number;
    infinite: boolean;
    layers: Layer[];
    tilesets: Tileset[];
    tilewidth: number;
    tileheight: number;
    type: string;
    version: string;
    width: number;
}

interface TilesetImageData {
    image: HTMLImageElement;
    columns: number;
    tileWidth: number;
    tileHeight: number;
    tileCount: number;
    firstgid: number;
    isImageCollection?: boolean;
    tiles?: Map<number, HTMLImageElement>; // For image collection tilesets
}

interface AnimationFrame {
    frames: TileAnimation[];
    currentFrame: number;
    lastUpdate: number;
}

interface TiledMapViewerProps {
    jsonPath: string;
}

export const TiledMapViewer: React.FC<TiledMapViewerProps> = ({ jsonPath }) => {
    const [mapData, setMapData] = useState<MapData | null>(null);
    const [tilesetImages, setTilesetImages] = useState<Record<number, TilesetImageData>>({});
    const [animationFrames, setAnimationFrames] = useState<Record<number, AnimationFrame>>({});
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    // Load the tilemap JSON
    useEffect(() => {
        const loadMap = async () => {
            try {
                const response = await fetch(jsonPath);
                if (!response.ok) throw new Error('Failed to load map data');
                const data: MapData = await response.json();
                setMapData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };
        loadMap();
    }, [jsonPath]);

    // Load tileset images
    useEffect(() => {
        if (!mapData) return;

        const loadImages = async () => {
            const images: Record<number, TilesetImageData> = {};
            const animations: Record<number, AnimationFrame> = {};

            for (const tileset of mapData.tilesets) {
                const isImageCollection = tileset.columns === 0;

                if (isImageCollection) {
                    // Image collection tileset - each tile has its own image
                    const tileImages = new Map<number, HTMLImageElement>();

                    if (tileset.tiles) {
                        for (const tile of tileset.tiles) {
                            if (tile.image) {
                                const img = new Image();
                                const imagePath = tile.image.replace(/^base\//, '/assets/');

                                await new Promise<void>((resolve) => {
                                    img.onload = () => resolve();
                                    img.onerror = () => {
                                        console.warn(`Failed to load image: ${imagePath}`);
                                        resolve();
                                    };
                                    img.src = imagePath;
                                });

                                tileImages.set(tile.id, img);
                            }
                        }
                    }

                    // Create a dummy main image for the collection
                    const dummyImg = new Image();
                    images[tileset.firstgid] = {
                        image: dummyImg,
                        columns: 0,
                        tileWidth: tileset.tilewidth,
                        tileHeight: tileset.tileheight,
                        tileCount: tileset.tilecount,
                        firstgid: tileset.firstgid,
                        isImageCollection: true,
                        tiles: tileImages
                    };
                } else {
                    // Regular tileset with single spritesheet
                    const img = new Image();
                    const imagePath = tileset.image.replace(/^base\//, '/assets/');

                    await new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => {
                            console.warn(`Failed to load image: ${imagePath}`);
                            resolve();
                        };
                        img.src = imagePath;
                    });

                    images[tileset.firstgid] = {
                        image: img,
                        columns: tileset.columns,
                        tileWidth: tileset.tilewidth,
                        tileHeight: tileset.tileheight,
                        tileCount: tileset.tilecount,
                        firstgid: tileset.firstgid
                    };
                }

                // Process animations
                if (tileset.tiles) {
                    tileset.tiles.forEach(tile => {
                        if (tile.animation) {
                            const globalId = tileset.firstgid + tile.id;
                            animations[globalId] = {
                                frames: tile.animation,
                                currentFrame: 0,
                                lastUpdate: Date.now()
                            };
                        }
                    });
                }
            }

            setTilesetImages(images);
            setAnimationFrames(animations);
        };

        loadImages();
    }, [mapData]);

    // Animation loop
    useEffect(() => {
        if (!mapData || Object.keys(animationFrames).length === 0) return;

        const animate = () => {
            const now = Date.now();
            let updated = false;

            const newFrames = { ...animationFrames };

            Object.keys(newFrames).forEach(tileIdStr => {
                const tileId = Number(tileIdStr);
                const anim = newFrames[tileId];
                const currentFrameData = anim.frames[anim.currentFrame];
                const elapsed = now - anim.lastUpdate;

                if (elapsed >= currentFrameData.duration) {
                    anim.currentFrame = (anim.currentFrame + 1) % anim.frames.length;
                    anim.lastUpdate = now;
                    updated = true;
                }
            });

            if (updated) {
                setAnimationFrames(newFrames);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mapData, animationFrames]);

    // Render the map to canvas
    useEffect(() => {
        if (!mapData || !canvasRef.current || Object.keys(tilesetImages).length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = mapData.width * mapData.tilewidth;
        canvas.height = mapData.height * mapData.tileheight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Helper function to get tileset for a tile ID
        const getTilesetForGid = (gid: number): TilesetImageData | null => {
            const tilesetKeys = Object.keys(tilesetImages)
                .map(Number)
                .sort((a, b) => b - a);

            for (const firstgid of tilesetKeys) {
                if (gid >= firstgid) {
                    return tilesetImages[firstgid];
                }
            }
            return null;
        };

        // Helper function to handle flipped tiles
        const extractGidInfo = (gid: number) => {
            const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
            const FLIPPED_VERTICALLY_FLAG = 0x40000000;
            const FLIPPED_DIAGONALLY_FLAG = 0x20000000;

            return {
                gid: gid & ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG),
                flippedHorizontally: (gid & FLIPPED_HORIZONTALLY_FLAG) !== 0,
                flippedVertically: (gid & FLIPPED_VERTICALLY_FLAG) !== 0,
                flippedDiagonally: (gid & FLIPPED_DIAGONALLY_FLAG) !== 0
            };
        };

        // Draw each layer
        mapData.layers.forEach(layer => {
            if (layer.type !== 'tilelayer' || !layer.visible) return;

            // Get layer offsets (default to 0 if not specified)
            const layerOffsetX = layer.offsetx || 0;
            const layerOffsetY = layer.offsety || 0;

            layer.data.forEach((gid, index) => {
                if (gid === 0) return; // Empty tile

                const { gid: cleanGid, flippedHorizontally, flippedVertically, flippedDiagonally } = extractGidInfo(gid);

                // Check if this tile is animated
                let actualGid = cleanGid;
                if (animationFrames[cleanGid]) {
                    const anim = animationFrames[cleanGid];
                    const currentFrame = anim.frames[anim.currentFrame];
                    const tileset = getTilesetForGid(cleanGid);
                    if (tileset) {
                        actualGid = tileset.firstgid + currentFrame.tileid;
                    }
                }

                const tileset = getTilesetForGid(actualGid);
                if (!tileset) return;

                const localId = actualGid - tileset.firstgid;
                const tileX = index % mapData.width;
                const tileY = Math.floor(index / mapData.width);

                // For image collection tilesets, get the individual tile image
                let tileImage: HTMLImageElement;
                let srcX = 0;
                let srcY = 0;
                let renderWidth: number;
                let renderHeight: number;

                if (tileset.isImageCollection && tileset.tiles) {
                    const individualImage = tileset.tiles.get(localId);
                    if (!individualImage || !individualImage.complete || individualImage.naturalWidth === 0) return;

                    tileImage = individualImage;
                    renderWidth = individualImage.naturalWidth;
                    renderHeight = individualImage.naturalHeight;
                    // For image collection, source is the entire image
                    srcX = 0;
                    srcY = 0;
                } else {
                    // Regular spritesheet tileset
                    if (!tileset.image.complete || tileset.image.naturalWidth === 0) return;

                    tileImage = tileset.image;
                    renderWidth = tileset.tileWidth;
                    renderHeight = tileset.tileHeight;
                    // Calculate source position in tileset spritesheet
                    srcX = (localId % tileset.columns) * tileset.tileWidth;
                    srcY = Math.floor(localId / tileset.columns) * tileset.tileHeight;
                }

                // Calculate destination position on canvas with layer offset
                const destX = tileX * mapData.tilewidth + layerOffsetX;
                const destY = tileY * mapData.tileheight + layerOffsetY;

                // Tiles larger than the grid size should be aligned to bottom-left of the grid cell
                // This is the standard Tiled behavior for large tiles
                const offsetX = 0;
                const offsetY = renderHeight - mapData.tileheight;

                // Apply transformations if needed
                ctx.save();

                if (flippedHorizontally || flippedVertically || flippedDiagonally) {
                    // For flipped tiles, use the center of the actual tile size
                    ctx.translate(destX + renderWidth / 2 - offsetX, destY + renderHeight / 2 - offsetY);

                    if (flippedDiagonally) {
                        ctx.rotate(Math.PI / 2);
                        ctx.scale(1, -1);
                    }
                    if (flippedHorizontally) {
                        ctx.scale(-1, 1);
                    }
                    if (flippedVertically) {
                        ctx.scale(1, -1);
                    }

                    ctx.drawImage(
                        tileImage,
                        srcX, srcY,
                        renderWidth, renderHeight,
                        -renderWidth / 2, -renderHeight / 2,
                        renderWidth, renderHeight
                    );
                } else {
                    // Draw at actual size with offset
                    ctx.drawImage(
                        tileImage,
                        srcX, srcY,
                        renderWidth, renderHeight,
                        destX - offsetX, destY - offsetY,
                        renderWidth, renderHeight
                    );
                }

                ctx.restore();
            });
        });
    }, [mapData, tilesetImages, animationFrames]);

    if (error) {
        return (
            <div style={{ padding: '20px', color: '#ef4444', background: '#fee', borderRadius: '8px' }}>
                <h3>Error loading tilemap</h3>
                <p>{error}</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Make sure the JSON path is correct and tileset images are in the /assets/ directory.
                </p>
            </div>
        );
    }

    if (!mapData) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Loading tilemap...
            </div>
        );
    }

    return (

        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                imageRendering: 'pixelated'
            }}
        />
    );
};

export default TiledMapViewer;