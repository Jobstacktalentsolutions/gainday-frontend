import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/formatDate";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    useCandidateNotifications,
    useHasUnreadNotifications,
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
} from "../hooks/useCandidateNotifications";
import type { CandidateNotification } from "../types/notification";

const NotificationBell = () => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selected, setSelected] = useState<CandidateNotification | null>(null);

    const { data: hasUnread } = useHasUnreadNotifications();
    const { data: notifications, isLoading } = useCandidateNotifications(popoverOpen);
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const openNotification = (notification: CandidateNotification) => {
        setPopoverOpen(false);
        setSelected(notification);
        if (notification.readAt === null) markRead.mutate(notification.id);
    };

    return (
        <>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger
                    aria-label={hasUnread ? "Notifications, you have unread notifications" : "Notifications"}
                    className="relative flex size-10 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary-950"
                >
                    <Bell size={22} aria-hidden="true" />
                    {hasUnread && (
                        <span className="absolute top-2 right-2.5 size-2.5 rounded-full border-2 border-white bg-error-500" />
                    )}
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={12} className="w-88 gap-0 p-0">
                    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                        <p className="text-base font-medium text-neutral-900">Notifications</p>
                        {hasUnread && (
                            <button
                                type="button"
                                onClick={() => markAllRead.mutate()}
                                disabled={markAllRead.isPending}
                                className="cursor-pointer text-sm text-primary-600 hover:underline disabled:opacity-50"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading && <p className="px-4 py-6 text-center text-sm text-neutral-500">Loading…</p>}
                        {notifications?.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-neutral-500">No notifications yet.</p>
                        )}
                        {notifications?.map((notification) => {
                            const unread = notification.readAt === null;
                            return (
                                <button
                                    key={notification.id}
                                    type="button"
                                    onClick={() => openNotification(notification)}
                                    className={cn(
                                        "flex w-full cursor-pointer flex-col gap-1 border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-b-0",
                                        unread ? "bg-primary-50 hover:bg-primary-100" : "bg-white hover:bg-neutral-50",
                                    )}
                                >
                                    <span className={cn("text-sm text-neutral-900", unread && "font-semibold")}>
                                        {notification.title}
                                    </span>
                                    <span className="line-clamp-2 text-sm text-neutral-600">{notification.message}</span>
                                    <span className="text-xs text-neutral-400">{formatShortDate(notification.createdAt)}</span>
                                </button>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>

            <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent>
                    {selected && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl text-neutral-900">{selected.title}</DialogTitle>
                                <DialogDescription>{formatShortDate(selected.createdAt)}</DialogDescription>
                            </DialogHeader>
                            <p className="text-base text-neutral-700">{selected.message}</p>
                            {selected.metadata && (
                                <Link
                                    to={`/candidate/applications/${selected.metadata.submissionId}`}
                                    onClick={() => setSelected(null)}
                                    className="w-fit rounded-xl bg-primary-500 px-5 py-2.5 text-base text-white transition-colors hover:bg-primary-600"
                                >
                                    View application
                                </Link>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NotificationBell;
