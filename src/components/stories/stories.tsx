import { useEffect, useState } from 'react';
import './stories.css';
import { X } from 'lucide-react';
import ReactStories from 'react-insta-stories';
import axios from 'axios';

interface IStoryItem {
    id: number;
    storyId: number;
    sourceUrl: string;
    createdAt: string;
}

interface IStory {
    id: number;
    previewImageUrl: string;
    createdAt: string;
    items: IStoryItem[];
}

export const Stories = () => {
    const [stories, setStories] = useState<IStory[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<IStory>();

    useEffect(() => {
        let ignore = false;

        async function fetchStories() {
            try {
                const { data } = await axios.get<IStory[]>('http://localhost:5000/api/stories', { withCredentials: true });
                if (!ignore) {
                    setStories(data);
                }
            } catch (e) {
                console.error('[STORIES_FETCH_ERROR], ', e);
            }
        }

        fetchStories();
        return () => { ignore = true; };
    }, []);

    useEffect(() => {
        const prev = document.body.style.overflow;
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = prev || '';
        }
        
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev || '';
        };
    }, [open]);

    const onClickStory = (story: IStory) => {
        setSelectedStory(story);
        if (story.items.length > 0) {
            setOpen(true);
        }
    };

    return (
        <div className="stories">
            <h2 className="stories-title">Stories</h2>

            <div className="stories-track">
                {stories.length === 0 &&
                    [...Array(6)].map((_, index) => (
                        <div key={index} className="story-placeholder" />
                    ))}

                {stories.map((story) => (
                    <img
                        key={story.id}
                        onClick={() => onClickStory(story)}
                        className="story-image"
                        height={250}
                        width={200}
                        src={story.previewImageUrl}
                        alt={`Story ${story.id}`}
                        loading="lazy"
                    />
                ))}
            </div>

            {open && (
                <div className="story-modal" onClick={() => setOpen(false)}>
                    <div
                        className="story-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: 520 }}
                    >
                        <button
                            className="story-modal-button"
                            aria-label="Close stories"
                            onClick={() => setOpen(false)}
                        >
                            <X className="story-modal-close-icon" />
                        </button>

                        <ReactStories
                            onAllStoriesEnd={() => setOpen(false)}
                            stories={selectedStory?.items.map((item) => ({ url: item.sourceUrl })) || []}
                            defaultInterval={3000}
                            width={520}
                            height={800}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};