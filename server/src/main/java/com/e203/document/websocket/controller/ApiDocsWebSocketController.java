package com.e203.document.websocket.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.e203.document.collection.ApiDocs;
import com.e203.document.service.ApiDocsService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ApiDocsWebSocketController {
	private final ApiDocsService apiDocsService;

	// WebSocket 메시지 처리
	@MessageMapping("/edit/api/v1/projects/{projectId}/api-docs") // WebSocket 메시지 매핑
	@SendTo("/topic/api/v1/projects/{projectId}/api-docs") // 구독자에게 보낼 경로
	public String editApiDocs(@DestinationVariable int projectId
		, @Payload String newContent) {
		return apiDocsService.updateApiDocsContent(projectId, newContent).getContent();
	}
}
