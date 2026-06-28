"use client";

import { useState } from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Settings
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">Manage your project and team preferences.</p>
      </div>

      <div className="space-y-8">
        
        {/* Project Name */}
        <section className="bg-black border border-zinc-900 rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-semibold text-zinc-100 tracking-tight mb-2">Project Name</h3>
            <p className="text-sm text-zinc-500 mb-4">This is your project's name on Lumoris Labs.</p>
            <div className="max-w-md">
              <input 
                type="text" 
                defaultValue="Lumoris Labs"
                className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>
          <div className="bg-zinc-950 border-t border-zinc-900 px-6 py-3 flex justify-end">
            <button className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-md transition-colors hover:bg-zinc-200">
              Save
            </button>
          </div>
        </section>

        {/* Project ID */}
        <section className="bg-black border border-zinc-900 rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-semibold text-zinc-100 tracking-tight mb-2">Project ID</h3>
            <p className="text-sm text-zinc-500 mb-4">Used when interacting with the Lumoris API.</p>
            <div className="max-w-md flex items-center gap-2">
              <code className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 font-mono">
                prj_x8f92jdb91nml1
              </code>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="bg-black border border-zinc-900 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-zinc-100 tracking-tight mb-1">Team Members</h3>
              <p className="text-sm text-zinc-500">Manage who has access to this project.</p>
            </div>
            <button className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-md transition-colors hover:bg-zinc-200">
              Invite Member
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
                  G
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">gautam</div>
                  <div className="text-xs text-zinc-500">gautam@lumorislabs.online</div>
                </div>
              </div>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-1 rounded">Owner</span>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-black border border-red-900/30 rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-base font-semibold text-zinc-100 tracking-tight mb-2">Delete Project</h3>
            <p className="text-sm text-zinc-500 mb-6">
              The project will be permanently deleted, including all deployments and domains. This action is irreversible and can not be undone.
            </p>
            <button className="px-4 py-2 bg-red-500/10 text-red-500 text-sm font-medium rounded-md transition-colors hover:bg-red-500/20 border border-red-500/20">
              Delete Project
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
